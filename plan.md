# Plan: Stripe-Grade Docs Architecture (Part 2) — with Markdoc

## Context

The 4 docs pages have accurate CLI commands but are hardcoded JSX. Now migrating docs to Markdoc for clean content/code separation, while simultaneously building the full Stripe-grade layout: persistent sidebar, sticky top bar, "On This Page" TOC, prev/next navigation, and placeholder pages for future sections.

**Key findings:**
- `@markdoc/markdoc` not yet installed; `@markdoc/next.js` webpack plugin is NOT being used (manual Server Component render is better for this route structure)
- `prism-react-renderer ^2.4.1` already installed (`components/CodeBlock.tsx`) — reuse via Markdoc fence node override
- Zero heading `id` attrs on existing docs pages — Markdoc heading node override will auto-generate them from slugified text
- Turbopack NOT in use (`next dev` with no `--turbo`) — no compatibility concerns
- `lib/` only has `lib/utils.ts` — safe to add `lib/markdoc.ts` and `lib/docs-navigation.ts`
- Tailwind v4 syntax (`@import "tailwindcss"`)

**Install required:**
```
bun add @markdoc/markdoc js-yaml github-slugger
bun add -D @types/js-yaml @types/github-slugger
```

---

## Architecture

```
content/docs/                    ← Markdoc .md source files (content lives here)
  sign-commits.md
  team-identities.md
  build-agents.md
  prove-provenance.md
  installation.md
  concepts/
    identity-model.md            ← placeholder content
    key-rotation.md
    delegation.md
  reference/
    cli.md
    github-actions.md

markdoc/
  tags/
    callout.ts                   ← {% callout %} tag schema
  nodes/
    fence.ts                     ← override code block → prism-react-renderer
    heading.ts                   ← override headings → auto-generate id + scroll-mt-20

components/markdoc/
  Callout.tsx                    ← React component for {% callout %} tag
  CodeFence.tsx                  ← thin wrapper around existing CodeBlock.tsx

lib/
  docs-navigation.ts             ← single source of truth for sidebar nav
  markdoc.ts                     ← shared parse/transform utility

app/docs/
  layout.tsx                     ← 3-column grid (Client Component)
  page.tsx                       ← docs landing page (unchanged)
  sign-commits/page.tsx          ← thin Server Component, reads sign-commits.md
  team-identities/page.tsx
  build-agents/page.tsx
  prove-provenance/page.tsx
  installation/page.tsx
  concepts/[topic]/page.tsx      ← catch-all for placeholder concept pages
  reference/[topic]/page.tsx     ← catch-all for placeholder reference pages

components/docs/
  DocsTopBar.tsx
  DocsSidebar.tsx
  DocsMobileDrawer.tsx           ← auto-closes on pathname change
  OnThisPage.tsx                 ← bounding-rect scroll spy
  DocsPrevNext.tsx
  DocWrapper.tsx                 ← wraps prose + DocsPrevNext (DRY footer)
```

---

## Architecture Decisions

1. **Manual Markdoc, no plugin**: `app/docs/*/page.tsx` are Server Components that call `fs.readFileSync` + `parseDoc()`. No webpack loader needed. Simpler, no Turbopack risk.

2. **Heading IDs auto-generated**: Override the `heading` Markdoc node to inject `id` from slugified text. No manual `id` attrs on every `<h2>`.

3. **Smooth scroll**: `app/globals.css` gets `html { scroll-behavior: smooth; }`. Heading override also adds `scroll-margin-top: 5rem` via Tailwind class `scroll-mt-20`.

4. **Fence → existing CodeBlock**: Markdoc `fence` node renders `CodeFence` component, which wraps the existing `components/CodeBlock.tsx` (prism-react-renderer, `oneDark` theme). No code duplication.

5. **Catch-all placeholder routes**: `app/docs/concepts/[topic]/page.tsx` and `app/docs/reference/[topic]/page.tsx` render "Coming soon" from the corresponding `.md` file — no 5 duplicate files. The `.md` files are minimal (3-line frontmatter + 1 placeholder sentence).

6. **DocWrapper**: Every docs page wraps content in `<DocWrapper>` which auto-includes `<DocsPrevNext />`. Future page-bottom widgets only require changing `DocWrapper.tsx`.

7. **Drawer auto-close**: `DocsMobileDrawer` has `useEffect(() => { onClose() }, [pathname])` — closes when a nav link is clicked (App Router doesn't full-reload).

8. **ScrollSpy**: `OnThisPage` tracks bounding-rect proximity, not `isIntersecting`. Uses `rectMap = useRef(new Map())`. Active = heading whose `top` value is smallest positive number (closest to viewport top without scrolling past). `rootMargin: '-100px 0px -40% 0px'`.

---

## Tasks (in order)

### Task 1 — Install Markdoc dependencies
```
bun add @markdoc/markdoc js-yaml
bun add -D @types/js-yaml
```

### Task 2 — `lib/docs-navigation.ts`
Nav data file with sections: **Getting Started** (Overview, Installation) → **Guides** (4 pages) → **Concepts** (3 placeholder items with `badge: 'soon'`) → **Reference** (2 with `badge: 'soon'`).

FLATTENED_NAV computed once at module level:
```ts
const FLATTENED_NAV = docsNavigation.flatMap(s =>
  s.items.flatMap(item => [item, ...(item.items ?? [])])
)
export function getPrevNext(currentPath: string) { /* uses FLATTENED_NAV */ }
```

JSDoc on all exports with `@param`, `@returns`, `@example`.

### Task 3 — `markdoc/nodes/heading.ts` + `markdoc/nodes/fence.ts`
**heading node**: Auto-generates `id` from slugified text using `github-slugger` for GitHub-parity results (handles `?`, `&`, punctuation correctly). Falls back to explicit `id` attribute if provided. Adds `scroll-mt-20` Tailwind class.

```ts
import GithubSlugger from 'github-slugger'
const slugger = new GithubSlugger()

const generateID = (children: any[], attributes: any) => {
  if (attributes.id && typeof attributes.id === 'string') return attributes.id
  const text = children.filter((c) => typeof c === 'string').join(' ')
  return slugger.slug(text)
}
```

**fence node**: Routes to `CodeFence` component. Passes `language` and `content` attributes.

### Task 4 — `markdoc/tags/callout.ts` + `components/markdoc/Callout.tsx`
`{% callout type="info|warning|error" title="..." %}` tag. Renders a styled box. Used for docs tips and warnings.

### Task 5 — `components/markdoc/CodeFence.tsx`
Thin wrapper: imports `CodeBlock` from `@/components/CodeBlock`. Maps Markdoc `language` + `content` props to `CodeBlock`'s expected props. Marked `'use client'` (inherits from CodeBlock).

### Task 6 — `lib/markdoc.ts`
Shared parse utility. Also extracts a `toc` array server-side from the AST — **passed as a prop to `OnThisPage`** so the client doesn't need to query the DOM on mount (prevents layout shifts and hydration mismatches).

```ts
import Markdoc, { RenderableTreeNode } from '@markdoc/markdoc'
import yaml from 'js-yaml'
import GithubSlugger from 'github-slugger'
// ... tag/node imports

export interface TocItem { id: string; text: string; level: 2 | 3 }

/**
 * Parses a Markdoc source string into a renderable tree, frontmatter, and TOC.
 * @param source - Raw markdown string from the .md file
 * @returns { content, frontmatter, toc }
 * @example const { content, frontmatter, toc } = parseDoc(fs.readFileSync(...))
 */
export function parseDoc(source: string): {
  content: RenderableTreeNode
  frontmatter: Record<string, unknown>
  toc: TocItem[]
} {
  const ast = Markdoc.parse(source)
  const frontmatter = ast.attributes.frontmatter
    ? yaml.load(ast.attributes.frontmatter) as Record<string, unknown>
    : {}

  // Extract TOC from AST before transform
  const slugger = new GithubSlugger()
  const toc: TocItem[] = ast.children
    .filter(node => node.type === 'heading' && [2, 3].includes(node.attributes.level))
    .map(node => {
      const text = node.children.map(c => c.attributes?.content ?? '').join('')
      return { id: slugger.slug(text), text, level: node.attributes.level as 2 | 3 }
    })

  const content = Markdoc.transform(ast, config)
  return { content, frontmatter, toc }
}
```

### Task 7 — Migrate 4 docs pages to `.md` + thin page.tsx

**TOC bridging pattern**: The Server Component page extracts `toc` from `parseDoc`, but the layout's right column (`OnThisPage`) is a Client Component. Bridge these with a `TocContext` (created in `lib/toc-context.tsx`):
- `TocProvider` (Client Component, wraps layout children) holds `toc` state
- `TocSetter` (tiny Client Component, rendered by each page) calls `setToc(toc)` on mount
- `OnThisPage` reads from `TocContext` — no DOM query needed

For each of the 4 docs pages:
1. Create `content/docs/<slug>.md` with YAML frontmatter (`title`, `description`) + prose content matching what was previously inline JSX
2. Rewrite `app/docs/<slug>/page.tsx` as a Server Component:
   ```tsx
   export default async function Page() {
     const source = fs.readFileSync(path.join(process.cwd(), 'content/docs/<slug>.md'), 'utf8')
     const { content, frontmatter, toc } = parseDoc(source)
     const rendered = Markdoc.renderers.react(content, React, { components })
     return (
       <>
         <TocSetter toc={toc} />
         <DocWrapper>{rendered}</DocWrapper>
       </>
     )
   }
   export async function generateMetadata() { /* reads frontmatter.title/description */ }
   ```

**Code blocks in the .md files**: Use standard fenced code blocks (`` ```bash ``). The fence node override routes them to `CodeFence` → `CodeBlock` → prism-react-renderer.

**Heading IDs**: No manual `id` attrs needed — the heading node override generates them automatically from text.

### Task 8 — Create `app/docs/installation/page.tsx` + `content/docs/installation.md`
Same pattern as Task 7. Content: `cargo install`, Homebrew, Linux binary, `auths --version` verification.

### Task 9 — Catch-all placeholder routes + .md files
**`app/docs/concepts/[topic]/page.tsx`** and **`app/docs/reference/[topic]/page.tsx`**: Dynamic segment reads `content/docs/concepts/<topic>.md` or `content/docs/reference/<topic>.md` and renders it.

Each route file must export `generateStaticParams` so Next.js pre-renders all paths at build time (instead of on-demand server rendering):
```ts
export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content/docs/concepts')
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => ({ topic: f.replace(/\.md$/, '') }))
}
```
Same pattern for `reference/[topic]/`.

Create 5 minimal `.md` files (3-line frontmatter + "This page is coming soon" sentence + `auths --help` tip).

### Task 10 — Create `components/docs/` components
- `DocsTopBar.tsx`: `BackToHome`, `TopNavLinks`, `MobileMenuTrigger`, `GitHubLink` sub-components
- `DocsSidebar.tsx`: Reads `docsNavigation`, renders sections. Badge=`'soon'` → gray non-link with badge
- `DocsMobileDrawer.tsx`: Backdrop + slide-in drawer + `useEffect` auto-close on pathname
- `OnThisPage.tsx`: Accepts `toc: TocItem[]` prop (server-extracted, no DOM query on mount). Uses `rectMap` ref + bounding-rect scroll spy for active state tracking.
- `DocsPrevNext.tsx`: Uses `getPrevNext()` from `lib/docs-navigation.ts`
- `DocWrapper.tsx`: `<article className="prose prose-gray max-w-none">{children}<DocsPrevNext /></article>`

### Task 11 — Rewrite `app/docs/layout.tsx`
3-column grid. Client Component (`'use client'`, needs `useState` for mobile menu). Wraps children in `TocProvider` so pages can set TOC for `OnThisPage` to read. No `export const metadata`.

```tsx
<div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_220px] gap-8">
  <aside className="hidden lg:block sticky top-[calc(3.5rem+1px)] h-[calc(100vh-3.5rem-1px)] overflow-y-auto py-8">
    <DocsSidebar />
  </aside>
  <main className="py-8 min-w-0">{children}</main>
  <aside className="hidden lg:block sticky top-[calc(3.5rem+1px)] h-[calc(100vh-3.5rem-1px)] overflow-y-auto py-8">
    <OnThisPage />
  </aside>
</div>
```

### Task 12 — Add `scroll-behavior: smooth` to `app/globals.css`
One line: `html { scroll-behavior: smooth; }`

---

## Critical Files

| File | Action |
|------|--------|
| `lib/docs-navigation.ts` | Create |
| `lib/markdoc.ts` | Create |
| `lib/toc-context.tsx` | Create (TocProvider + TocSetter + useToc hook) |
| `markdoc/nodes/heading.ts` | Create |
| `markdoc/nodes/fence.ts` | Create |
| `markdoc/tags/callout.ts` | Create |
| `components/markdoc/Callout.tsx` | Create |
| `components/markdoc/CodeFence.tsx` | Create (wraps existing `components/CodeBlock.tsx`) |
| `components/docs/DocsTopBar.tsx` | Create |
| `components/docs/DocsSidebar.tsx` | Create |
| `components/docs/DocsMobileDrawer.tsx` | Create (with pathname auto-close) |
| `components/docs/OnThisPage.tsx` | Create (bounding-rect scroll spy) |
| `components/docs/DocsPrevNext.tsx` | Create |
| `components/docs/DocWrapper.tsx` | Create |
| `app/docs/layout.tsx` | Rewrite (3-column grid) |
| `app/globals.css` | Add `scroll-behavior: smooth` |
| `content/docs/sign-commits.md` | Create (migrate from page.tsx) |
| `content/docs/team-identities.md` | Create |
| `content/docs/build-agents.md` | Create |
| `content/docs/prove-provenance.md` | Create |
| `content/docs/installation.md` | Create |
| `content/docs/concepts/*.md` (×3) | Create (placeholder content) |
| `content/docs/reference/*.md` (×2) | Create (placeholder content) |
| `app/docs/sign-commits/page.tsx` | Rewrite → Server Component + `DocWrapper` |
| `app/docs/team-identities/page.tsx` | Rewrite |
| `app/docs/build-agents/page.tsx` | Rewrite |
| `app/docs/prove-provenance/page.tsx` | Rewrite |
| `app/docs/installation/page.tsx` | Create |
| `app/docs/concepts/[topic]/page.tsx` | Create (dynamic catch-all) |
| `app/docs/reference/[topic]/page.tsx` | Create (dynamic catch-all) |

---

## Verification

1. `bun run build` — all routes compile cleanly, no TypeScript errors
2. `/docs` — landing page with guide cards, no redirect
3. `/docs/sign-commits`:
   - Top bar: "← Auths" + "Guides" (active tab) + GitHub link
   - Left sidebar: all nav sections; current page highlighted blue; "Concepts"/"Reference" items gray with "soon" badge
   - Right column: "On this page" with anchor links for each h2 in the page
   - Clicking a TOC link scrolls smoothly to the heading (not obscured by top bar)
   - TOC highlights stay active while user is reading that section (not just when heading is in view)
   - Bottom: "← Installation / Team Identities →"
4. Mobile (<1024px): hamburger opens slide-in drawer; clicking a link closes drawer automatically
5. `/docs/concepts/identity-model` — renders "Coming soon" page, not 404
6. Code blocks render with `prism-react-renderer` syntax highlighting (not raw `<pre>`)

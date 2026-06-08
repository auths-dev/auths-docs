# Auths Documentation Site

A modern, Stripe-grade documentation site for [Auths](https://github.com/auths-dev/auths) built with Next.js, Markdoc, and Tailwind CSS.

## Features

- **Clean content separation**: Markdown source files in `content/docs/`, rendered via Markdoc
- **Responsive 3-column layout**: Persistent sidebar navigation, sticky top bar, "On This Page" TOC
- **Syntax highlighting**: Code blocks rendered with Prism React Renderer
- **Auto-generated heading IDs**: Smooth scroll anchors with GitHub-compatible slug generation
- **Mobile-friendly**: Slide-in drawer navigation for screens under 1024px
- **Static pre-rendering**: Catch-all routes for placeholder pages

## Prerequisites

- **bun** `>=1.0.0` ([install bun](https://bun.sh))
- **Node.js** `>=18.0.0`

## Quick Start

### 1. Install dependencies

```bash
bun install
```

### 2. Run the development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The site will auto-reload when you edit files.

### 3. Build for production

```bash
bun run build
```

### 4. Start the production server

```bash
bun start
```

## Project Structure

```
auths-docs/
├── app/                          # Next.js app directory
│   ├── docs/
│   │   ├── layout.tsx            # 3-column grid layout
│   │   ├── page.tsx              # Docs landing page
│   │   ├── [topic]/page.tsx       # Dynamic guide pages
│   │   ├── concepts/[topic]/page.tsx    # Placeholder concept routes
│   │   └── reference/[topic]/page.tsx   # Placeholder reference routes
│   ├── globals.css               # Global styles + smooth scroll
│   └── layout.tsx                # Root layout
├── components/
│   ├── docs/                     # Docs-specific components
│   │   ├── DocsTopBar.tsx
│   │   ├── DocsSidebar.tsx
│   │   ├── DocsMobileDrawer.tsx
│   │   ├── OnThisPage.tsx
│   │   ├── DocsPrevNext.tsx
│   │   └── DocWrapper.tsx
│   ├── markdoc/                  # Markdoc-specific components
│   │   ├── Callout.tsx
│   │   └── CodeFence.tsx
│   └── CodeBlock.tsx             # Prism React Renderer wrapper
├── content/
│   └── docs/                     # Markdown source files
│       ├── sign-commits.md
│       ├── installation.md
│       ├── concepts/
│       └── reference/
├── lib/
│   ├── docs-navigation.ts        # Nav data + prev/next utilities
│   ├── markdoc.ts                # Parse + transform Markdoc
│   └── toc-context.tsx           # TOC state context
├── markdoc/
│   ├── tags/
│   │   └── callout.ts            # {% callout %} tag schema
│   └── nodes/
│       ├── heading.ts            # Auto-generate heading IDs
│       └── fence.ts              # Code block override
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md                     # This file
```

## Writing Docs

### Create a new guide page

1. Create a Markdown file in `content/docs/`

   ```markdown
   ---
   title: "Page Title"
   description: "Short description for metadata"
   ---

   ## Section Heading

   Content here. Code blocks are automatically syntax-highlighted.

   ```bash
   auths sign-commit --help
   ```

   ### Subsection

   More content...
   ```

2. Add a route file in `app/docs/<slug>/page.tsx`

   ```tsx
   import fs from 'fs'
   import path from 'path'
   import { parseDoc } from '@/lib/markdoc'
   import Markdoc from '@markdoc/markdoc'
   import React from 'react'
   import { TocSetter } from '@/lib/toc-context'
   import { DocWrapper } from '@/components/docs/DocWrapper'

   export default async function Page() {
     const source = fs.readFileSync(
       path.join(process.cwd(), 'content/docs/<slug>.md'),
       'utf8'
     )
     const { content, frontmatter, toc } = parseDoc(source)
     const rendered = Markdoc.renderers.react(content, React)

     return (
       <>
         <TocSetter toc={toc} />
         <DocWrapper>{rendered}</DocWrapper>
       </>
     )
   }

   export async function generateMetadata() {
     // Generate SEO metadata from frontmatter
   }
   ```

3. Update `lib/docs-navigation.ts` to add the new page to the sidebar

### Using Markdown features

#### Code blocks with syntax highlighting

Use standard fenced code blocks with language specifier:

````markdown
```typescript
const greeting = 'Hello, Auths!'
console.log(greeting)
```
````

Supported languages: `bash`, `typescript`, `javascript`, `json`, `yaml`, `python`, `go`, `rust`, and more via Prism.

#### Callout boxes

Use the `{% callout %}` tag:

```markdown
{% callout type="info" title="Pro Tip" %}
This is a callout box. Use `type="warning"` or `type="error"` for different styles.
{% endcallout %}
```

#### Headings (auto-anchored)

Headings automatically generate IDs for smooth scrolling:

```markdown
## This becomes an anchor

You can link to it with `[link](#this-becomes-an-anchor)`.
The ID is generated from the heading text using GitHub-compatible slug rules.
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server at http://localhost:3000 |
| `bun run build` | Build for production |
| `bun start` | Start production server (requires build) |
| `bun run lint` | Run ESLint |
| `bun run type-check` | Run TypeScript type checker |

## Architecture Highlights

### Manual Markdoc rendering

Instead of using the `@markdoc/next.js` webpack plugin, pages are Server Components that call `parseDoc()` to render Markdown. This gives fine-grained control over the route structure and avoids Turbopack complications.

### Automatic heading IDs

The Markdoc `heading` node override uses `github-slugger` to generate URL-safe IDs from heading text. This enables smooth scroll navigation without manual `id` attributes. The generated IDs match GitHub's slug format (handles punctuation, unicode, etc.).

### Table of Contents context

Instead of querying the DOM on client mount (which causes layout shifts and hydration mismatches), the server extracts the TOC from the Markdoc AST and passes it via React Context (`TocProvider` in the layout). This prevents jank and ensures the TOC is always in sync with the page content.

### Scroll spy tracking

The `OnThisPage` component uses bounding-rect proximity tracking (not Intersection Observer) to determine the active heading. This keeps the TOC active as the user reads, not just when a heading enters the viewport.

### Catch-all placeholder routes

Placeholder pages (coming soon) use dynamic segments (`[topic]`) with `generateStaticParams` for static pre-rendering:

```tsx
export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content/docs/concepts')
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => ({ topic: f.replace(/\.md$/, '') }))
}
```

This generates routes for all `.md` files at build time, avoiding `404`s while keeping the file count low.

## Performance Tips

- **Static builds**: Run `bun run build` before deployment. Next.js pre-renders all docs pages.
- **Code splitting**: Route pages are lazy-loaded; only the current page's code is downloaded.
- **Smooth scrolling**: Enabled globally in `app/globals.css` via `html { scroll-behavior: smooth; }`.

## Troubleshooting

### Port 3000 already in use

```bash
# Kill the process using port 3000, or specify a different port
bun run dev --port 3001
```

### Styles not updating in dev mode

Restart the dev server:

```bash
# Press Ctrl+C to stop
bun run dev
```

### Markdoc parsing errors

Check the Markdown syntax:
- YAML frontmatter must be at the top, enclosed in `---`
- Code blocks need a language specifier (e.g., `` ```bash ``)
- Callout tags must have `type` attribute: `{% callout type="info" %}`

## Contributing

1. Create a branch for your docs changes
2. Add or edit `.md` files in `content/docs/`
3. Update navigation in `lib/docs-navigation.ts` if adding new pages
4. Test locally: `bun run dev`
5. Build for production: `bun run build`
6. Commit and push; open a PR

## Deployment

The site is built as a static Next.js app suitable for:
- **Vercel** (native Next.js support)
- **Netlify** (via `next export`)
- **Self-hosted** (using `bun start` or a Node.js runtime)

For static export (when dynamic routes aren't needed):

```bash
# In next.config.ts, set output: 'export'
bun run build
# Outputs to ./out/
```

## Related

- [Auths GitHub](https://github.com/auths-dev/auths)
- [Next.js Documentation](https://nextjs.org/docs)
- [Markdoc Documentation](https://markdoc.io)
- [Tailwind CSS](https://tailwindcss.com)

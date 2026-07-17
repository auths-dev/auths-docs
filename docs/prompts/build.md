# Build plan — auths docs revamp on Markdoc (Stripe's OSS stack, no lock-in)

**Goal:** rebuild the auths documentation as a small, beautiful, Stripe-grade site that
takes a developer from *"what is auths-mcp"* to *"I bounded a real agent to a budget and
verified the receipt myself"* — on a stack **we own**, with a design and architecture that
stay clean as the product grows. Ship ~10 pages of `auths-mcp` first; push the deeper auths
(signing, verify, identity) docs further down; make everything else cheap to add later.

**Why this repo, not Mintlify.** This site (`auths-docs-stripe`) is **Next.js 15 +
Markdoc**. Markdoc is Stripe's open-source authoring framework (MIT) — the same engine
behind Stripe's own docs. We render it ourselves in our own Next app, so there is **no
vendor lock-in**: no proprietary `docs.json`, no hosted-only components, no platform we
can't leave. The tradeoff is we build the chrome (layout, code tabs, search) — which is
exactly what this plan specifies, and most of the bones already exist here.

- **Repo:** `/Users/bordumb/workspace/repositories/auths-base/auths-docs-stripe`
- **Run:** `bun dev` (or `npm run dev`) → `http://localhost:3000/docs`
- **Stack today:** Next 15 (App Router) · `@markdoc/markdoc ^0.5.7` · Tailwind v4 ·
  `prism-react-renderer` · content in `content/docs/*.md`.
- **Scope this pass:** `auths-mcp` (the bounded-agent gateway) leads. The existing
  signing/identity content is **demoted, not deleted**.

---

## 0. Ground truth — read before writing a line

Every command, flag, verdict, and provider detail must come from real source. Invent
nothing. Priority order:

1. **`auths-mcp` repo docs** — `../auths-mcp/docs/` (`index.md`, `walkthrough.md`,
   `ai-providers/*`, `payment-providers/*`) and `clients/README.md`. ~90% of the content;
   this pass is **port + tighten + redesign**, not net-new writing.
2. **Gateway source** — `../auths/crates/auths-mcp-gateway/src/main.rs` (the clap CLI is the
   authority on `wrap` flags/subcommands) and `../auths/crates/auths-mcp-core` (verdicts,
   rail extractors). **When prose and source disagree, source wins** (§10).
3. **Positioning / voice** — the marketing site (`../auths-site`,
   `apps/web/src/components/landing-ledger.tsx`, `/verify`, `/trust`). The docs must feel
   like the same product: the promise is *"your agent can't exceed its budget, and you can
   prove it,"* and the recurring beat is a **refusal with a receipt**.

The verified surface is pinned in **Appendix A** — canonical; reconcile every code block
against it and `auths-mcp-gateway wrap --help`.

---

## 1. Current state — what's here, and the debt a "complete revamp" must clear

The repo already has a Stripe-shaped skeleton (3-pane layout, sidebar, on-this-page,
prev/next). Good bones. But four architectural problems block the design and scale goals,
and all four must be fixed as part of the revamp:

| # | Problem (today) | Why it blocks us | Fix (this plan) |
|---|---|---|---|
| **D1** | `lib/markdoc.ts` renders to an **HTML string** via `Markdoc.renderers.html` + `dangerouslySetInnerHTML`. | Custom Markdoc tags can never become **interactive React** — so synchronized code tabs, copy buttons, live verdict chips are impossible from content. `markdoc/tags` and `markdoc/nodes` are **empty**. | Render with `Markdoc.renderers.react`; populate the tag/node schema. **The keystone fix** — nothing else interactive works without it. (§6) |
| **D2** | Every page is a **hand-written** `app/docs/<slug>/page.tsx` that hardcodes the content path **and** duplicates title/description in `generateMetadata`. | Adding a page = writing React + duplicating frontmatter. Doesn't scale; drifts. | One `app/docs/[...slug]/page.tsx` catch-all; metadata from frontmatter; `generateStaticParams` from the content tree. (§6) |
| **D3** | `components/docs/CodeExamples.tsx` is a hardcoded `Record<pathname, …>` in a **right rail keyed by URL**, divorced from the prose. | Code samples live apart from the content that explains them; can't be authored inline; no language sync. | Content-authored `{% code-tabs %}` with a **global synced language** (§5). Retire the URL-keyed map. |
| **D4** | `lib/docs-navigation.ts` is a hand-maintained array that **leads with "Sign Commits / Team Identities"** (the old product) and drifts from the files. | Wrong product first; nav and content can disagree silently. | Derive nav from content **frontmatter** (`section`, `order`, `badge`); **auths-mcp leads**, signing demoted. (§7–8) |

Also flagged for the revamp: `components/markdoc/Callout.tsx` uses **emoji** (💡 ⚠️ ❌) —
replaced by a real icon set (§4); design tokens are stock gray/blue Tailwind — replaced by
a brand system (§4).

---

## 2. Honesty / dependency callouts (resolve before "Install" ships)

The gateway is real and passes its full suite (`run.sh --check`: wrap, scope/budget gating,
signed receipts, tamper + drop detection, metered Stripe/x402 settlement, a live MCP wire).
But *distribution* is mid-flight — the docs must not promise an install that 404s:

- **npm publish pending.** `@auths-dev/mcp` is not yet on npm (`package.json` → `"private":
  true`, `0.0.0`). Until published, `npx @auths-dev/mcp wrap …` will 404. Gate the Install
  page's runnable lines behind an availability note, or ship after publish.
- **Per-platform binary vendoring pending.** The launcher resolves a prebuilt gateway from
  `vendor/<platform>/`, populated by a release CI that doesn't exist in `auths-mcp` yet.
  Headline the one-line `npx` path; mark `brew`/`uvx` "fast-follow."
- **Package name is `@auths-dev/mcp` / `auths-mcp`.** Sweep for stray `@auths/mcp` (it
  survives in some source comments and the marketing hero — being corrected; don't copy).

---

## 3. Principles (the spine — every page, every component)

1. **One quick win, fast, with zero money at risk.** A reader wraps a *filesystem* server
   and watches a refusal inside five minutes — trust earned before we ask for a live key.
2. **Lead with the refusal.** Every page's payoff is the gateway saying *no*
   (`usage-cap-exceeded`, `outside-agent-scope`, `revoked`) with a receipt.
3. **Every command is real and runnable.** Real strings, real verdicts (Appendix A).
4. **Danger is loud.** Payment rails are **real money by default**; every page that can
   touch a live rail opens with a danger callout and shows `--test-mode` *first*.
5. **Teach each idea once.** The cap, custody, receipts each get exactly one home page;
   everything links there.
6. **Ten pages, not a hundred.** Off the critical path → deferred (§11), not built now.
7. **Content is data, not code.** After the D1/D2 fixes, a page is a `.md` file — an agent
   or a non-engineer can add one. Protect that property; never regress to per-page React.

---

## 4. Design — Stripe-grade ease of use, unmistakably auths

The bar: a developer lands and immediately feels *"this is going to be easy."* That feeling
is made of layout discipline, restraint, real typography, and code blocks that do exactly
what you expect. Concretely:

### 4a. Layout — the Stripe three-pane, used well
Keep the scaffolded grid `[sidebar | content | right-rail]` (`app/docs/layout.tsx`), refined:

- **Left rail (nav):** sections as small-caps eyebrows; the current page marked with the
  accent and a hairline indicator; collapsible groups; a persistent product switch at the
  top (**auths-mcp** vs **Identity & signing**) so the two product areas never tangle.
- **Center (prose):** one comfortable measure (~72ch), generous line-height (1.7), clear
  h2/h3 rhythm, hairline section rules. This is a reading column, not a wall.
- **Right rail:** **"On this page"** TOC (already built, keep) — and, on guide pages that
  earn it, Stripe's signature **sticky code panel**: the runnable commands for the current
  section pin on the right and swap as you scroll. This replaces the hardcoded
  `CodeExamples` (D3) with content-authored, section-anchored code.
- **Mobile:** the drawer (already built) closes on navigate; the sticky code panel collapses
  into inline blocks. No horizontal scroll; tables and wide code scroll inside their own box.

### 4b. Icons — a real set, never emoji
Remove every emoji (starting with `Callout.tsx`'s 💡⚠️❌). Adopt **Lucide** (`lucide-react`,
MIT, tree-shakeable) — the marketing site already uses it, so icons match across properties.
Map meaning to icon, consistently: info → `Info`, warning → `TriangleAlert`, danger →
`OctagonAlert`, success/allowed → `Check`, refusal/denied → `Ban`, receipt → `ReceiptText`,
key/custody → `KeyRound`, terminal → `SquareTerminal`. Icons are line-weight, currentColor,
sized to the text — decoration never carries meaning alone (pair with a label for a11y).

### 4c. Brand — clean like Stripe, warm like auths
There's a real tension to resolve (flag in §12): the marketing "ledger" is warm paper
(`#f6f3ec`) / ink (`#1c1814`) / seal (`#c2401b`); Stripe docs are cool white / indigo. For
**docs specifically** (long reading + dense code needs crisp contrast), the recommended
synthesis:

- **Canvas:** a clean, high-contrast near-white (not the warm paper) for the reading column;
  the warm paper can tint the nav rail for identity.
- **One accent:** the **seal `#c2401b`** — links, active nav, focus rings, primary buttons.
  Exactly one accent, like Stripe's single indigo.
- **Keep the receipt/terminal motif:** code and verdict blocks use the marketing site's dark
  terminal (`#15130f`) — the only dark objects on the page, reading like photographs tipped
  into a document. The reserved red `#c0442e` is used for **one meaning only: a denial /
  `refused` verdict** — never decorative.
- **Type:** a refined sans for prose (Geist, matching marketing), true monospace in code, a
  display face (Fraunces) reserved for page titles if we want the editorial signature. Small
  caps for section eyebrows.
- Full **light/dark** support; both themes styled, respecting `prefers-color-scheme` with a
  manual toggle.

### 4d. Code blocks — the thing developers actually touch
Code is the product surface of docs; make it excellent:

- **Copy button** on every block (none today). One-click, with copied-state feedback.
- **Filename / label header** and language pill.
- **Syntax highlighting** worthy of Stripe — `prism-react-renderer` is fine to start;
  consider **Shiki** (VS Code grammars, exact fidelity) as an upgrade (flag §12).
- **Line highlighting / focus** for step-by-step (`{% code highlight="2-3" %}`).
- **Verdict chips:** inline `allowed` (seal) / `refused` (reserved red) tokens so a receipt
  reads like the real terminal output, not gray text.
- No layout shift on hydration; blocks render server-side and stay put.

### 4e. Synchronized multi-language code tabs (the headline request)
When a tool exists in several languages (the **verifier/SDK**: Rust crate, WASM/npm, Python
& Go & Swift via FFI — and even within auths-mcp: `npx` vs `brew` vs `uvx`, or CLI vs the
Python recorder), the reader picks a language **once** and **every** code block on the page
follows. Build it now, even though auths-mcp v0 is CLI-heavy — it's the foundation SDK docs
will lean on.

Design:

- **`LanguageProvider`** (React context) holds the active language, hydrated from
  `localStorage('auths.docs.lang')` and restored on load; SSR renders a stable default (no
  flash, no layout shift).
- A Markdoc tag **`{% code-tabs %}`** wraps N `{% code-tab lang="python" file="verify.py" %}`
  children. Every `CodeTabs` instance **subscribes to the shared context** — switching the
  tab in one block sets the global language, and all blocks re-render to it. This is the
  "anchored across all code blocks" behavior.
- **Graceful fallback:** if a block lacks the chosen language, it shows its default and a
  quiet note (*"Not available in Python — showing Bash"*) rather than breaking the set.
- **Keyboard + a11y:** tabs are a real ARIA tablist, arrow-key navigable, focus-visible.
- **Deep-linkable:** honor `?lang=python` on load so shared links land in the right language.

Retire `components/docs/CodeExamples.tsx` (the URL-keyed map) in favor of this — code lives
inline with the prose that explains it.

### 4f. Small touches that read as "easy"
Persistent, working **search** (flag scope in §11); a **"Copy page as Markdown / Open in
ChatGPT/Claude"** affordance (cheap, on-brand for a "check it yourself" product); **"Edit
this page"** + **"Last reviewed"** on every page (§11); breadcrumbs; anchored headings with
hover-to-link; a real 404 that routes back into the nav.

---

## 5. Content information architecture — the 10 pages (auths-mcp leads)

Three groups, ten pages — the shortest path from *what is it* to *I bounded a real agent and
verified it*. Each spec: **purpose · the one thing it lands · real commands/verdicts ·
components · what to leave out.** Routes are `/docs/<slug>`; content is `content/docs/<slug>.md`.

### Group A — Get started (zero → first refusal)
**A1 `mcp/index.md` — The bounded agent.** *What/why in 30s.* Lands: the gateway holds a
scoped, budget-bound, revocable delegation and **refuses any `tools/call` that exceeds it**;
the cap is a seatbelt (**cannot**, not shouldn't). A 4-line terminal: `allowed` → then
`usage-cap-exceeded` with a receipt id. Two cards: **Quickstart (no money)** /
**Spend real money**. *Components:* card group, terminal block, verdict chips. *Leave out:*
architecture, crypto internals.

**A2 `mcp/install.md` — Install.** Shortest page. Lands: the one-line `npx` form is the
headline; `brew`/`uvx` fast-follow. Prereqs (Node 18+, a downstream MCP server); verify with
`auths-mcp wrap --show-mode …` (touches nothing). *Components:* synced code-tabs
(npx/brew/uvx), availability warning (§2). *Leave out:* a platform-binary matrix.

**A3 `mcp/quickstart.md` — Wrap your first server (no money, 5 min).** The quick win. Lands:
prepend one `wrap` line to a filesystem MCP server with `--scope fs.read --budget '$1'
--ttl 30m`; an in-scope call is `allowed`, an out-of-scope `write_file` is
`outside-agent-scope` — **no card, no wallet.** *Components:* steps, the `mcp.json` snippet
(from `clients/README.md`), verdict chips. *Leave out:* payments, custody, revocation.

### Group B — Core ideas (the read-once mental model)
**B1 `mcp/concepts/how-it-works.md` — The gate.** Lands: stock MCP up and down; **every
`tools/call`** runs one gate — scope ⊆ parent · budget · expiry · revocation · authenticity
— forwards **only** on `allowed`, **fails closed**. One receipt per call. *Components:* the
data-flow diagram (adapt `payment-providers/stripe.md`), five bounds each with its verdict.

**B2 `mcp/concepts/budgets.md` — The seatbelt & the cross-rail moat.** Lands: a durable
cross-rail counter, pre-authorized (reserve before the rail, settle after) — `$4.99` Stripe
+ `$4.99` x402 = `$9.98` of a `$5` cap → next call on **either** rail refused. Real money is
default; `--test-mode` is the single opt-in; the cap is **mandatory** (`budget-required`,
both modes). *Components:* danger callout, mode table, `--show-mode` habit.

**B3 `mcp/concepts/custody.md` — The agent never holds the key.** Lands: gateway is a
credential-custody broker (`--custody-credential NAME` adopts from its env; `NAME=VALUE`
injects); bypass → no credential → unbypassable. Secret never touches wire, receipts, logs.

**B4 `mcp/concepts/receipts.md` — Prove it yourself.** Lands: every gated call is signed +
logged; anyone re-derives spend **offline** with `verify-spend`; tampering is caught. The
verdict table lives here (Appendix A); one paragraph on **revocation** (next call fails on
every rail at once). *Components:* steps (verify → tamper), verdict table.

### Group C — Do the real thing (bound real money)
**C1 `mcp/guides/spend-real-money.md` — Walkthrough (flagship).** Port
`auths-mcp/docs/walkthrough.md`: Step 0 disclose mode (`--show-mode`), Step 1 Stripe, Step 2
x402 (same cap), Step 3 a real `claude-opus-4-8` loop hitting the wall, "kill it instantly"
(revoke), safety checklist. **Open with the real-money danger callout; `--test-mode` first.**
This page earns the **sticky right-hand code panel** (§4a). *Components:* steps, danger,
checklist, synced tabs, sticky code.

**C2 `mcp/providers/stripe.md` — Stripe rail.** Port `payment-providers/stripe.md`: live
`sk_live_…` default; meters `charge.amount_captured` from Stripe's own response; over-cap
refused **before** Stripe is called; `--test-mode` → `sk_test_…`; the "small reconcile";
troubleshooting. *Components:* danger, synced tabs (test/live), troubleshooting accordion.

**C3 `mcp/providers/x402.md` — x402 / USDC rail.** Port `payment-providers/x402.md`: base
**mainnet** default; needs a **funded wallet + facilitator** (warn loudly — not a key
drop-in); atomic-USDC→cents exact-only; meters into the **same** cap (the moat); `--test-mode`
→ base-sepolia; faucet link. *Components:* warning + danger, synced tabs.

> **Demoted, not deleted — "Identity & signing" (secondary top-level section).** The existing
> `content/docs/*.md` (sign-commits, team-identities, build-agents, prove-provenance,
> installation, authentication, concepts/*, reference/*) move **below** the auths-mcp
> section, clearly secondary. Keep them reachable; do not lead with them. No page linked from
> the auths-mcp section leads with commit signing.

---

## 6. Architecture revamp (the foundation for §4 and §11)

Do these first — the design and scale goals depend on them.

1. **Render to React (fixes D1).** Rewrite `lib/markdoc.ts` to use `Markdoc.renderers.react`
   with a `components` map, not `renderers.html` + `dangerouslySetInnerHTML`. Custom tags now
   become interactive components. *Everything interactive depends on this.*
2. **Populate the Markdoc schema.** `markdoc/nodes/`: `heading` (auto-id + `scroll-mt`, keep
   the slugger), `fence` (→ the new copy-enabled `CodeBlock`). `markdoc/tags/`: `callout`,
   `code-tabs` + `code-tab`, `card`/`card-group`, `steps`/`step`, `verdict`, `receipt`,
   `snippet` (§11). Each tag = a schema file + a React component in `components/markdoc/`.
3. **One catch-all route (fixes D2).** Replace the per-page files with
   `app/docs/[...slug]/page.tsx`: resolve slug → `content/docs/**.md`, parse, render; derive
   `<title>`/description/OG from **frontmatter**; `generateStaticParams` walks the content
   tree. Delete the hand-written page files as they're migrated.
4. **Filesystem-driven nav (fixes D4).** Generate `docsNavigation` from content frontmatter
   (`section`, `order`, `badge`) so nav can't drift from files. **auths-mcp is the first
   section;** identity/signing follow.
5. **Keep the good bones:** `OnThisPage`, `DocsPrevNext`, the drawer, the 3-pane grid — reuse
   as-is (restyled per §4).

---

## 7. Navigation config (target shape)

Frontmatter-driven; the array below is the *result*, not a hand-maintained source:

```
auths-mcp (LEAD)
  Get started      → mcp/index, mcp/install, mcp/quickstart
  Core ideas       → mcp/concepts/how-it-works, .../budgets, .../custody, .../receipts
  Spend real money → mcp/guides/spend-real-money, mcp/providers/stripe, mcp/providers/x402
Identity & signing (SECONDARY, demoted)
  → installation, sign-commits, team-identities, build-agents, prove-provenance, authentication
Concepts   → identity-model, key-rotation, delegation        (badge: soon, as today)
Reference  → cli, github-actions                              (badge: soon)
```

Top-of-sidebar **product switch** toggles the two product worlds so they never intermix.

---

## 8. Voice & copy rules (from the marketing site)

- **Say** can't / refused / proved / bounded / cannot. **Avoid** enables / empowers /
  leverages / seamless / robust; avoid hedges (just / simply / should / might) unless
  deliberate.
- **Never** put `KERI` / `CESR` / `DID` / `did:keri:…` in docs; mechanism words
  ("delegation", "key event log", "device-bound key") only inside how-it-works. Use
  `<agent>` / `<root>` placeholders.
- **Never** say "blockchain" / "decentralized" / "self-sovereign." x402 is "on-chain USDC
  settlement" (a mechanism), not a category.
- **Don't** lead with "offline verification" as the differentiator (everyone ships
  `--offline`). The edge: *the receipt re-derives against the key that signed it, checkable
  by anyone.*
- House style: active voice, second person, sentence-case headings, one idea per sentence,
  code formatting for commands/paths/verdicts. Real-money danger stated plainly, every time.

---

## 9. Grounding & anti-drift

- **Reconcile every command against the binary** before publishing. Known drift: prose docs
  wrap payment rails with `--scope paid.call` and **no** `--rail`, but the clap surface
  defines `--rail stripe|x402`. Run `auths-mcp-gateway wrap --help` and match it.
- **Verdict strings are exact** — only the ten in Appendix A. No paraphrase.
- **No fabricated output** — every terminal line reproducible via the documented command
  (`run.sh --check`, `examples/live/` are the real output shapes).
- **Package name** `@auths-dev/mcp` / `auths-mcp` everywhere; sweep stray `@auths/mcp`.

---

## 10. Scalability & anti-staleness — keep the docs true as the product moves

The failure mode we've already hit on the marketing site (links and commands drifting from
reality) is the thing to engineer against here. Build these guardrails as part of the revamp:

1. **Snippet transclusion (the big one).** A `{% snippet file="…" region="…" %}` tag pulls
   command/code blocks from **real, CI-run example files** in the `auths-mcp` repo instead of
   hand-copied strings. If the example changes, the doc changes; if the example breaks CI,
   we know before the doc lies. Use it for every command-bearing block that has a source of
   truth.
2. **Generated reference.** The CLI reference and the verdict table are **generated** from
   source — a script runs `auths-mcp-gateway wrap --help` → `content/docs/mcp/reference/cli.md`,
   and reads the verdict enum from `auths-mcp-core` → the verdict table. Never hand-maintained,
   never drifts. Wire it as a `bun run gen:reference` step + a CI check that fails if the
   committed output is stale.
3. **CI guardrails (cheap, high-value):**
   - **Link check** — internal + external; fail the build on any 404 (the marketing-site
     lesson, encoded).
   - **Verdict/name lint** — fail on any code block using a verdict string not in the enum,
     or any stray `@auths/mcp`.
   - **Frontmatter contract** — required fields (`title`, `description`, `section`, `order`,
     `lastReviewed`); build-time validation.
   - **Markdoc validation** — `Markdoc.validate()` in CI catches unknown tags/attrs before
     they render as nothing.
4. **Freshness surfaced, not hidden.** Every page shows **"Last reviewed <date>"** (from
   `lastReviewed` frontmatter) and an **"Edit this page"** link to its `.md` on GitHub. A
   scheduled job (weekly) opens an issue listing pages past a freshness threshold, so stale
   pages get triaged instead of rotting.
5. **Content-is-data compounding.** Because pages are `.md` + one catch-all route (§6), a new
   page needs **no React** — an engineer, a writer, or an agent adds a file. Protect this: no
   feature should reintroduce per-page components.
6. **Search at scale** — a build-time static index (e.g. a generated JSON + client search, or
   Pagefind) when the page count crosses ~20. Not v0; noted so the architecture leaves room.
7. **Design tokens, one source.** All color/spacing/type as CSS variables (mirroring the
   marketing `globals.css`), so a brand change is one file, not a hunt through components.

---

## 11. Deliberately NOT in this pass (the next ten)

Listed so we don't build them now and nothing secretly depends on them: per-client config
pages (Claude Desktop/Code/Cursor/Codex); the AI-provider / live-evidence recorder page
(`providers/anthropic`); the full generated CLI reference (infra in §10.2, page later);
a standalone revocation guide; a scopes reference; the multi-language **SDK** docs (they'll
lean hard on §4e — build the tabs now, the pages later); errors index; self-hosting the
binary; CI-usage guide; architecture deep-dive. If a v0 reader needs one, link GitHub or mark
"coming" — never stub a hollow page.

---

## 12. Open decisions (flag; don't block)

1. **Docs canvas** — clean near-white (recommended, for reading + code contrast) vs. the
   warm marketing paper. Accent = seal `#c2401b` either way.
2. **Highlighter** — keep `prism-react-renderer` (installed) or upgrade to **Shiki**
   (VS Code-grade). Recommend Shiki once tabs land.
3. **Install timing** — publish `@auths-dev/mcp` before docs go live, or ship with the
   availability callout (§2).
4. **`--rail` vs `--scope paid.call`** — confirm the current binary's required payment-wrap
   shape and standardize (§9).
5. **Fate of the Mintlify clone** (`../auths-docs`) — this plan supersedes it; decide whether
   to archive/delete that repo.

---

## 13. Definition of done (v0)

- [ ] `lib/markdoc.ts` renders **React** (not an HTML string); `markdoc/tags` + `markdoc/nodes`
      populated; **zero `dangerouslySetInnerHTML`** for content.
- [ ] One `app/docs/[...slug]` catch-all; per-page `page.tsx` files removed; metadata comes
      from frontmatter.
- [ ] Nav is frontmatter-driven; **auths-mcp is the first section**; identity/signing demoted
      below it; no auths-mcp page leads with commit signing.
- [ ] All 10 auths-mcp pages exist at the §5 slugs with real, reconciled commands.
- [ ] **No emoji anywhere**; Lucide icon set wired; `Callout.tsx` reworked.
- [ ] **Synchronized language tabs** work: switching one block switches all, persists across
      reloads, deep-links via `?lang=`, falls back gracefully, is keyboard/ARIA-correct.
- [ ] Every code block has a **copy button**; verdict chips styled; terminal/receipt motif +
      single seal accent; light/dark both styled.
- [ ] Every page that can touch a live rail opens with a real-money danger callout and shows
      `--test-mode` first.
- [ ] At least the CI **link check** + **verdict/name lint** + **frontmatter contract** are
      wired; **"Last reviewed" + "Edit this page"** render on every page.
- [ ] Copy audit passes: zero `blockchain|decentraliz|self-sovereign`, zero
      `KERI|CESR|did:keri` outside how-it-works, zero stray `@auths/mcp`.
- [ ] `bun dev` clean, no broken links; `bun run build` + `type-check` green.
- [ ] New reader can go index → quickstart and get a refusal with **no money at risk**, then
      index → walkthrough for the real-money payoff.
- [ ] Committed to a branch + PR; not force-published.

---

## Appendix A — Verified command & verdict surface (canonical)

Pinned from `auths/crates/auths-mcp-gateway/src/main.rs` and `auths-mcp-core`. Reconcile all
docs against this and `--help`; **source wins over prose.**

**Invocation:** installed `auths-mcp`; no-install `npx -y @auths-dev/mcp …`. Fast-follows:
`brew install auths-mcp`, `uvx auths-mcp` (pending, §2).
**Subcommands:** `wrap` · `replay` (hermetic `--check` gate) · `verify-spend` (offline re-audit).

**`wrap` flags:**

| Flag | Value | Meaning |
| --- | --- | --- |
| `--scope` | `CAP` (repeatable) | capability granted, e.g. `fs.read`, `paid.call` |
| `--budget` | `$5` / `20calls` | cross-rail cap; **mandatory** for payment rails |
| `--ttl` | `30m` | delegation lifetime |
| `--rail` | `stripe` \| `x402` | designates the payment rail (§9: reconcile vs prose) |
| `--test-mode` | flag | opt into SANDBOX rails (Stripe `sk_test_…`, x402 `base-sepolia`); env twin `AUTHS_MCP_TEST_MODE=1` |
| `--show-mode` | flag | resolve + disclose mode, then exit — dry run, no rail touched, no charge |
| `--custody-credential` | `NAME[=VALUE]` (repeatable) | secret the gateway custodies; bare `NAME` adopts from gateway env, `NAME=VALUE` injects |
| `-- <DOWNSTREAM>` | required | the wrapped MCP server command (everything after `--`) |

**`verify-spend`:** `auths-mcp-gateway verify-spend --log spend.jsonl --registry ./registry
--agent <agent> --root <root>` → prints `verify-spend: <hash> — <verdict>`.

**The ten verdicts (exact strings — the only ones that exist):**

| Verdict | Meaning |
| --- | --- |
| `allowed` | in bounds; forwarded, receipt written |
| `usage-cap-exceeded` | would cross the budget cap (refused before the rail is touched) |
| `outside-agent-scope` | capability the grant never gave |
| `agent-expired` | past the delegation TTL |
| `revoked` | root recorded a revocation; honored next call, every rail |
| `budget-required` | payment rail wrapped with no `--budget` (fail-closed, both modes) |
| `proof-unauthentic` | signature doesn't verify against the agent's key |
| `tampered-proof` | a signed proof was altered (caught offline) |
| `dropped-call` | a record removed from the log (caught by the back-link cross-check) |
| `budget-mismatch` | durable cross-rail counter disagrees with the log (e.g. tail truncation) |

**Modes:** REAL default (live Stripe `sk_live_…` @ `api.stripe.com`; x402 base **mainnet**,
real USDC). `--test-mode` → sandbox (Stripe `sk_test_…`; x402 `base-sepolia`). Mode always
disclosed at startup; live rails are never silent.

**Providers (v0 scope):** Stripe (key drop-in) · x402/USDC (funded wallet + facilitator).
Anthropic/`claude-opus-4-8` live recording is deferred (§11).

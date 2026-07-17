# Publishing to Vercel

How this site goes live, and how to keep it that way. It's a **Next.js (App Router) +
Markdoc** app, package-managed with **Bun**, deployed from GitHub
[`auths-dev/auths-docs`](https://github.com/auths-dev/auths-docs). Production tracks `main`.

> It is a *served* Next.js app, not a static export — `next.config.ts` defines
> redirects, so Vercel runs it with its Next.js adapter. Don't add `output: 'export'`.

The build config is pinned in [`vercel.json`](../../vercel.json) at the repo root, so the
correct framework, install, build, and output settings live in git — not in dashboard
toggles that can drift.

---

## ⚠️ Already have a Vercel project? (migrating from the old MkDocs site)

The existing Vercel project was set up for the **old MkDocs** docs and its Build &
Development Settings are now stale:

| Setting | Stale (MkDocs) value | Should be (Next.js) |
|---|---|---|
| Framework Preset | `Other` | **Next.js** |
| Install Command | `echo skip` | *default* (Bun, auto from `bun.lock`) |
| Build Command | `bash deploy/vercel/build.sh` | *default* (`next build`) |
| Output Directory | `site` | *default* (`.next`) |
| Root Directory | `./` | `./` (already correct) |

Deploying as-is **fails** — no install, a build script that no longer exists, and a
`site/` dir Next never produces. **The committed `vercel.json` overrides all of this
automatically on the next deploy** — defining each field (even as `null`) disables the
dashboard override and falls back to the Next.js default. Nothing to click.

To tidy the dashboard too (optional): **Settings → Build & Deployment** → set Framework
Preset to **Next.js** and turn off the three command overrides. Leave Root Directory `./`.

---

## First-time setup (once, ~5 min)

Use Vercel's Git integration — push-to-deploy, no tokens to manage.

1. **Prereqs:** a Vercel account with access to the `auths-dev` GitHub org.
2. **Import:** [vercel.com/new](https://vercel.com/new) → import `auths-dev/auths-docs`.
3. **Framework:** Next.js — pinned by `vercel.json` (and auto-detected). Leave every
   build/install override off; Vercel installs with **Bun** from `bun.lock` automatically.
4. **Root Directory:** `./` (the Next app is the repo root).
5. **Environment Variables:** none. The site needs no runtime secrets.
6. **Deploy.** Then in **Settings → Git**, confirm the Production Branch is `main`.
7. *(Optional)* **Settings → Domains** → add `docs.auths.dev` (or chosen domain) and
   point the DNS record Vercel shows you.

That's it. Every later push deploys on its own.

---

## Everyday deploys

| You do | Vercel does |
|---|---|
| Push / merge to `main` | Builds and deploys to **production** |
| Push any other branch, or open a PR | Builds a **preview** at a unique URL (commented on the PR) |

The [CI workflow](../../.github/workflows/ci.yml) (`bun run build`, `type-check`,
`bun run check`) is the quality gate — it runs on every PR. **Keep it green; merge on
green.** Vercel builds independently, so a red CI won't block a `main` deploy — the
branch protection / merge discipline is what protects production.

> The external-link check lives in `bun run check` (CI only), **not** in the Vercel
> build. A newly-broken external link fails CI, not the deploy.

---

## Manual deploy (CLI — optional)

For a one-off deploy without going through Git:

```bash
bun add -g vercel@latest   # or: npm i -g vercel@latest
vercel login
vercel link                # once, in the repo root → links to the project
vercel                     # preview deploy
vercel --prod              # production deploy
```

---

## Rollback

Production broke? Roll back instantly — no rebuild, same artifact:

- **Dashboard:** Deployments → pick the last good one → **Promote to Production** (Instant Rollback).
- **CLI:** `vercel rollback` (previous), or `vercel rollback <deployment-url>`.

---

## Maintenance notes

- **Bun lockfile** — keep `bun.lock` committed and in sync with `package.json`, or the
  frozen install fails on Vercel the same way it does in CI.
- **Redirects** live in `next.config.ts` and are served by Vercel automatically. Add new
  ones there, not in the dashboard.
- **Pin `next` to a concrete version, never `latest`.** Vercel reads the Next.js version
  straight from `package.json`; a dist-tag like `latest` is unparseable and fails the
  build with *"Could not identify Next.js version."* `next` and `eslint-config-next` are
  pinned to `16.2.1` for this reason. When you upgrade, bump to another exact version and
  recommit `bun.lock` — don't reach for `latest`.
- **Node version** — Vercel defaults to the current LTS. If a build needs a specific one,
  set it in **Settings → Build & Deployment → Node.js Version**.

## Verify a deploy

1. Open the production URL — the docs index and a `/docs/*` page render.
2. Hit a redirect, e.g. `/getting-started` → lands on `/docs/quickstart`.
3. Check the build log in the Vercel dashboard is clean (no Markdoc/frontmatter warnings).

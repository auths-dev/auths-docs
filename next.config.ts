import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 120,
  // Pin the workspace root so Turbopack never infers it from a stray lockfile
  // higher up the tree (a home-dir package-lock.json, a monorepo yarn.lock).
  // Vercel checks the repo out in isolation, but this keeps local and CI builds
  // identical to prod.
  turbopack: {
    root: import.meta.dirname,
  },
  // Source-of-truth consolidation (G6.4): this site is the canonical dev-facing
  // docs. Legacy "getting started" paths (incl. links from the older mkdocs
  // getting-started tree) redirect in a single hop to the canonical quickstart.
  async redirects() {
    return [
      { source: '/getting-started', destination: '/docs/idsigning/quickstart', permanent: true },
      { source: '/docs/getting-started', destination: '/docs/idsigning/quickstart', permanent: true },
      { source: '/docs/getting-started/:path*', destination: '/docs/idsigning/quickstart', permanent: true },
      // Identity & signing moved under /docs/idsigning — keep old links working.
      { source: '/docs/quickstart', destination: '/docs/idsigning/quickstart', permanent: false },
      { source: '/docs/installation', destination: '/docs/idsigning/installation', permanent: false },
      { source: '/docs/authentication', destination: '/docs/idsigning/authentication', permanent: false },
      { source: '/docs/sign-commits', destination: '/docs/idsigning/sign-commits', permanent: false },
      { source: '/docs/team-identities', destination: '/docs/idsigning/team-identities', permanent: false },
      { source: '/docs/build-agents', destination: '/docs/idsigning/build-agents', permanent: false },
      { source: '/docs/prove-provenance', destination: '/docs/idsigning/prove-provenance', permanent: false },
      { source: '/docs/concepts/:path*', destination: '/docs/idsigning/concepts/:path*', permanent: false },
      { source: '/docs/reference/:path*', destination: '/docs/idsigning/reference/:path*', permanent: false },
    ]
  },
}

export default nextConfig

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
      // The /docs prefix is gone — pages live at the root of docs.auths.dev.
      // Strip it from every old URL (e.g. /docs/mcp → /mcp).
      { source: '/docs', destination: '/mcp', permanent: false },
      { source: '/docs/:path*', destination: '/:path*', permanent: false },
      // The witness network is its own area — it anchors BOTH products and has
      // an operator audience that never touches auths-mcp.
      { source: '/mcp/witness-network', destination: '/witness-network', permanent: false },
      {
        source: '/mcp/witness-network/:path*',
        destination: '/witness-network/:path*',
        permanent: false,
      },
      // Pre-idsigning flat identity URLs → their new home under /idsigning.
      { source: '/quickstart', destination: '/idsigning/quickstart', permanent: false },
      { source: '/installation', destination: '/idsigning/installation', permanent: false },
      { source: '/authentication', destination: '/idsigning/authentication', permanent: false },
      { source: '/sign-commits', destination: '/idsigning/sign-commits', permanent: false },
      { source: '/team-identities', destination: '/idsigning/team-identities', permanent: false },
      { source: '/build-agents', destination: '/idsigning/build-agents', permanent: false },
      { source: '/prove-provenance', destination: '/idsigning/prove-provenance', permanent: false },
      { source: '/concepts/:path*', destination: '/idsigning/concepts/:path*', permanent: false },
      { source: '/reference/:path*', destination: '/idsigning/reference/:path*', permanent: false },
      // Legacy getting-started.
      { source: '/getting-started', destination: '/idsigning/quickstart', permanent: true },
      { source: '/getting-started/:path*', destination: '/idsigning/quickstart', permanent: true },
    ]
  },
}

export default nextConfig

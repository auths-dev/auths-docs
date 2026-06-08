import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 120,
  // Source-of-truth consolidation (G6.4): this site is the canonical dev-facing
  // docs. Legacy "getting started" paths (incl. links from the older mkdocs
  // getting-started tree) redirect in a single hop to the canonical quickstart.
  async redirects() {
    return [
      { source: '/getting-started', destination: '/docs/quickstart', permanent: true },
      { source: '/docs/getting-started', destination: '/docs/quickstart', permanent: true },
      { source: '/docs/getting-started/:path*', destination: '/docs/quickstart', permanent: true },
    ]
  },
}

export default nextConfig

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔐</span>
            <span className="font-semibold text-gray-900 text-lg">Auths</span>
          </div>
          <a
            href="https://github.com/auths-dev/auths"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Cryptographically verify code provenance
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Sign commits, manage team identities, and prove the origin of your code with Auths. Production-ready tooling for secure software supply chains.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/docs/installation"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
              >
                Get Started
              </a>
              <a
                href="/docs/sign-commits"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-900 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition"
              >
                Read the Guide
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Documentation</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Guides */}
            <div className="group cursor-pointer">
              <a href="/docs/sign-commits" className="block">
                <div className="mb-4">
                  <span className="text-3xl">📖</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  Guides
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Learn how to sign commits, manage team identities, build agents, and prove code provenance.
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  Explore
                  <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </a>
            </div>

            {/* Concepts */}
            <div className="group cursor-pointer">
              <a href="/docs/concepts/identity-model" className="block">
                <div className="mb-4">
                  <span className="text-3xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  Concepts
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Understand the identity model, key rotation, delegation mechanisms, and cryptographic foundations.
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  Learn
                  <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </a>
            </div>

            {/* Reference */}
            <div className="group cursor-pointer">
              <a href="/docs/reference/cli" className="block">
                <div className="mb-4">
                  <span className="text-3xl">⚙️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  Reference
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Complete CLI reference, API documentation, and GitHub Actions integration details.
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  Reference
                  <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔐</span>
              <span className="font-semibold text-gray-900">Auths</span>
            </div>
            <div className="flex gap-8">
              <a
                href="https://github.com/auths-dev/auths"
                className="text-sm text-gray-600 hover:text-gray-900 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://anthropic.com"
                className="text-sm text-gray-600 hover:text-gray-900 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Anthropic
              </a>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-8">
            © 2024 Anthropic. Auths is open source and available on GitHub.
          </p>
        </div>
      </footer>
    </main>
  )
}

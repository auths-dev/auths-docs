import Link from 'next/link'

export default function DocsPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
        <p className="text-xl text-gray-600">
          Learn how to use Auths to sign commits, manage identities, and prove code provenance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          href="/docs/sign-commits"
          className="group border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition"
        >
          <div className="text-2xl mb-3">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2 transition">
            Sign Commits
          </h3>
          <p className="text-gray-600 text-sm">
            Get started with cryptographic commit signing. Learn the basics and best practices.
          </p>
        </Link>

        <Link
          href="/docs/team-identities"
          className="group border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition"
        >
          <div className="text-2xl mb-3">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2 transition">
            Team Identities
          </h3>
          <p className="text-gray-600 text-sm">
            Manage multiple identities for your team. Organize and verify contributor keys.
          </p>
        </Link>

        <Link
          href="/docs/build-agents"
          className="group border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition"
        >
          <div className="text-2xl mb-3">🤖</div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2 transition">
            Build Agents
          </h3>
          <p className="text-gray-600 text-sm">
            Automate code signing with agents. Integrate signing into your CI/CD pipeline.
          </p>
        </Link>

        <Link
          href="/docs/prove-provenance"
          className="group border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition"
        >
          <div className="text-2xl mb-3">🔗</div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2 transition">
            Prove Provenance
          </h3>
          <p className="text-gray-600 text-sm">
            Verify the origin of code. Prove that commits are authentic and traceable.
          </p>
        </Link>
      </div>
    </div>
  )
}

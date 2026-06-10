'use client'

import { usePathname } from 'next/navigation'

interface CodeExample {
  label: string
  language: string
  code: string
}

const codeExamples: Record<string, CodeExample[]> = {
  '/docs/sign-commits': [
    {
      label: 'Sign a commit (automatic after init)',
      language: 'bash',
      code: `git commit -m "Add new feature"`,
    },
    {
      label: 'Verify the latest commit',
      language: 'bash',
      code: `auths verify HEAD`,
    },
    {
      label: 'Verify any commit or range',
      language: 'bash',
      code: `auths verify abc1234
auths verify main..HEAD`,
    },
  ],
  '/docs/team-identities': [
    {
      label: 'Share your identity',
      language: 'bash',
      code: `auths whoami`,
    },
    {
      label: 'Pin a teammate',
      language: 'bash',
      code: `auths trust pin \\
  --did did:keri:E... \\
  --key <pubkey-hex>`,
    },
    {
      label: 'Export a CI bundle',
      language: 'bash',
      code: `auths id export-bundle --alias main \\
  --output .auths/ci-bundle.json \\
  --max-age-secs 31536000`,
    },
  ],
  '/docs/build-agents': [
    {
      label: 'Delegate an agent',
      language: 'bash',
      code: `auths id agent add \\
  --label ci-bot --key main \\
  --scope sign_commit`,
    },
    {
      label: 'Sign in CI',
      language: 'yaml',
      code: `- uses: auths-dev/sign@v1
  with:
    files: 'dist/*'
    auths-version: '0.1.2'`,
    },
    {
      label: 'Verify in CI',
      language: 'yaml',
      code: `- uses: auths-dev/verify@v1
  with:
    auths-version: '0.1.2'
    identity-bundle: .auths/ci-bundle.json`,
    },
  ],
  '/docs/prove-provenance': [
    {
      label: 'Verify a commit range',
      language: 'bash',
      code: `auths verify main..HEAD`,
    },
    {
      label: 'Sign an artifact',
      language: 'bash',
      code: `auths artifact sign release.tar.gz`,
    },
    {
      label: 'Stateless verification (CI)',
      language: 'bash',
      code: `auths verify HEAD \\
  --identity-bundle .auths/ci-bundle.json`,
    },
  ],
  '/docs/installation': [
    {
      label: 'Install via Homebrew',
      language: 'bash',
      code: `brew install auths-dev/auths-cli/auths`,
    },
    {
      label: 'Install via Cargo',
      language: 'bash',
      code: `cargo install auths-cli`,
    },
    {
      label: 'Verify installation',
      language: 'bash',
      code: `auths --version
auths doctor`,
    },
  ],
}

export function CodeExamples() {
  const pathname = usePathname()
  const examples = codeExamples[pathname] || []

  if (examples.length === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="sticky top-14 bg-white pt-2 pb-4">
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
          Examples
        </h3>
      </div>

      {examples.map((example, idx) => (
        <div key={idx} className="space-y-2">
          <p className="text-xs font-medium text-gray-600">{example.label}</p>
          <div className="relative group">
            <pre className="bg-gray-950 text-gray-100 p-3 rounded text-xs leading-relaxed overflow-x-auto border border-gray-800">
              <code className="font-mono">{example.code}</code>
            </pre>
          </div>
        </div>
      ))}

      <div className="text-center pt-4">
        <a
          href="https://github.com/auths-dev/auths"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          View on GitHub →
        </a>
      </div>
    </div>
  )
}

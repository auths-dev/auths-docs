'use client'

import { usePathname } from 'next/navigation'

interface CodeExample {
  label: string
  language: string
  code: string
}

const codeExamples: Record<string, CodeExample[]> = {
  '/docs/authentication': [
    {
      label: 'Global API Key',
      language: 'java',
      code: `Auths.apiKey = "sk_test_51TGscvIB1g0UUU6yd3n3ez2V68sHLZIpPA56a3CkogTn4F5naM6WXjguK478dEGN5y79mJxFkqDQCgNDMJlqvH0Q00yUobFuRC";`,
    },
    {
      label: 'Per-Request API Key',
      language: 'java',
      code: `RequestOptions requestOptions = RequestOptions.builder()
  .setApiKey("sk_test_51TGscvIB1g0UUU6yd3n3ez2V68sHLZIpPA56a3CkogTn4F5naM6WXjguK478dEGN5y79mJxFkqDQCgNDMJlqvH0Q00yUobFuRC")
  .build();
Charge charge = Charge.retrieve(
  "ch_3Ln3ga2eZvKYlo2C11iwHdxy",
  requestOptions,
);`,
    },
  ],
  '/docs/sign-commits': [
    {
      label: 'Sign a commit',
      language: 'bash',
      code: `auths sign-commit -m "Add new feature"`,
    },
    {
      label: 'Verify a commit',
      language: 'bash',
      code: `auths verify-commit <commit-hash>`,
    },
    {
      label: 'Check signature',
      language: 'bash',
      code: `git log --oneline -1
auths verify-commit abc1234`,
    },
  ],
  '/docs/team-identities': [
    {
      label: 'Create identity',
      language: 'bash',
      code: `auths identity create \\
  --name "alice" \\
  --email "alice@example.com"`,
    },
    {
      label: 'List identities',
      language: 'bash',
      code: `auths identity list`,
    },
    {
      label: 'Export public key',
      language: 'bash',
      code: `auths identity export-public-key alice`,
    },
  ],
  '/docs/build-agents': [
    {
      label: 'Create agent',
      language: 'bash',
      code: `auths agent create \\
  --name "ci-bot" \\
  --type github-actions`,
    },
    {
      label: 'Get token',
      language: 'bash',
      code: `auths agent get-token ci-bot`,
    },
    {
      label: 'GitHub Actions',
      language: 'yaml',
      code: `- uses: auths-dev/auths-action@v1
  with:
    agent-token: \${{ secrets.AUTHS_TOKEN }}`,
    },
  ],
  '/docs/prove-provenance': [
    {
      label: 'Verify branch',
      language: 'bash',
      code: `auths verify-branch main`,
    },
    {
      label: 'Generate proof',
      language: 'bash',
      code: `auths prove --ref v1.0.0 \\
  --output proof.json`,
    },
    {
      label: 'Check commit',
      language: 'bash',
      code: `auths verify-commit abc1234 \\
  --require-signed`,
    },
  ],
  '/docs/installation': [
    {
      label: 'Install via Cargo',
      language: 'bash',
      code: `cargo install auths`,
    },
    {
      label: 'Install via Homebrew',
      language: 'bash',
      code: `brew install auths-dev/auths-cli/auths`,
    },
    {
      label: 'Verify installation',
      language: 'bash',
      code: `auths --version
auths health`,
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

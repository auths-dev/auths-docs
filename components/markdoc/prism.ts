import { Prism } from 'prism-react-renderer'

/**
 * Registers Prism grammars that prism-react-renderer does not bundle.
 *
 * prism-react-renderer vendors only a subset of Prism languages. Any fence
 * whose grammar is missing silently falls back to a single plain token, so
 * the whole block — comments included — renders in one color. Bash is the
 * heaviest-used language in this content and is NOT in the vendored set,
 * which is why `# comment` lines used to read exactly like commands.
 *
 * This module is the single, site-wide fix: it uses the library's documented
 * extension point (expose the Prism instance on the global, then load the
 * grammar module, which mutates `Prism.languages`). Import it once from any
 * component that renders code; every fence on every page picks it up.
 *
 * To support a new fence language later, check `Prism.languages` first (many
 * grammars ARE vendored — json, yaml, rust, python, ts, go, …) and only add
 * a `require('prismjs/components/prism-<lang>')` line here if it is missing.
 */
;(globalThis as typeof globalThis & { Prism?: unknown }).Prism = Prism

// Grammar modules attach to the global Prism as a side effect, so they must
// load AFTER the assignment above — hoisted `import` statements would run
// first, hence `require`.
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('prismjs/components/prism-bash')

export { Prism }

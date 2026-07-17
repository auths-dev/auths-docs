'use client'

import { useCallback, useState } from 'react'
import { Highlight, themes, type PrismTheme } from 'prism-react-renderer'
import '@/components/markdoc/prism'

/**
 * The code surface of the docs, in the ledger's artifact frame: a dark pane
 * (#15130f) that reads like a photograph tipped into the page. Every block
 * has a one-click copy; `language="output"` (or "terminal") renders a
 * session transcript with verdict-colored lines instead of syntax highlight.
 */

const OK = '#e8845c'
const DENY = '#e2664a'
const DIM = '#9a948c'
const BODY = '#d6d3d1'

/**
 * Base highlight theme with comments pushed firmly into the background. The eye
 * has to separate "run this" from "read this" at a glance, so comments — whole
 * line or trailing annotation — render dim and italic while the command stays
 * bright. Without this the base theme's comment hue sits too close to the code.
 */
const CODE_THEME: PrismTheme = {
  ...themes.gruvboxMaterialDark,
  styles: [
    ...themes.gruvboxMaterialDark.styles,
    { types: ['comment', 'prolog', 'cdata', 'shebang'], style: { color: '#736e64', fontStyle: 'italic' } },
  ],
}

/**
 * Fence-language normalization. Aliases collapse onto the grammar that is
 * actually registered, and a fence with NO language renders as plain text —
 * previously it defaulted to "bash", which mislabeled ASCII diagrams and,
 * now that the bash grammar is real, would half-highlight them.
 */
const LANGUAGE_ALIASES: Record<string, string> = {
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  console: 'bash',
}

/** Transcript copy: only the runnable `$ ` lines, prompt stripped. */
function commandsOnly(code: string): string {
  const commands = code
    .split('\n')
    .filter((line) => line.startsWith('$ '))
    .map((line) => line.slice(2))
  return commands.length > 0 ? commands.join('\n') : code
}

function parseHighlight(spec?: string): Set<number> {
  const lines = new Set<number>()
  if (!spec) return lines
  for (const part of spec.split(',')) {
    const [a, b] = part.split('-').map((n) => parseInt(n.trim(), 10))
    if (Number.isNaN(a)) continue
    const end = Number.isNaN(b as number) || b === undefined ? a : b
    for (let i = a; i <= end; i++) lines.add(i)
  }
  return lines
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable — the text stays selectable.
    }
  }, [text])

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy code"
      className="rounded-sm px-1.5 py-0.5 font-mono text-[11px] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-stone-400"
      style={{ color: copied ? OK : DIM }}
    >
      {copied ? 'copied' : 'copy'}
    </button>
  )
}

/** A transcript line: verdicts and prompts colored like the real terminal. */
function TerminalLine({ line }: { line: string }) {
  if (line.startsWith('✓')) return <div style={{ color: OK }}>{line}</div>
  if (line.startsWith('✗')) return <div style={{ color: DENY }}>{line}</div>
  if (line.startsWith('#')) return <div style={{ color: DIM }}>{line}</div>
  if (line.startsWith('$ ')) {
    return (
      <div>
        <span className="select-none" style={{ color: DIM }}>
          $&nbsp;
        </span>
        <span style={{ color: BODY }}>{line.slice(2)}</span>
      </div>
    )
  }
  return <div style={{ color: BODY }}>{line}</div>
}

export interface CodeBlockProps {
  content: string
  language?: string
  filename?: string
  label?: string
  highlight?: string
}

export function CodeBlock({ content, language, filename, label, highlight }: CodeBlockProps) {
  const code = content.replace(/\n$/, '')
  const lang = LANGUAGE_ALIASES[language ?? ''] ?? language ?? 'text'
  const isTerminal = lang === 'output' || lang === 'terminal'
  const header = filename ?? label
  const highlighted = parseHighlight(highlight)

  return (
    <div className="not-prose group my-6 overflow-hidden rounded-lg bg-[#15130f] shadow-[0_18px_45px_-14px_rgba(28,24,20,0.4)] ring-1 ring-black/20">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <span className="font-mono text-[11px] tracking-wider" style={{ color: DIM }}>
          {header ?? (isTerminal ? 'terminal' : lang)}
        </span>
        <span className="flex items-center gap-3">
          {header && !isTerminal ? (
            <span className="font-mono text-[11px]" style={{ color: '#6e6960' }}>
              {lang}
            </span>
          ) : null}
          <CopyButton text={isTerminal ? commandsOnly(code) : code} />
        </span>
      </div>

      {isTerminal ? (
        <div className="space-y-1 overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed">
          {code.split('\n').map((line, i) => (
            <TerminalLine key={i} line={line} />
          ))}
        </div>
      ) : (
        <Highlight theme={CODE_THEME} code={code} language={lang}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed">
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line })
                const isHot = highlighted.has(i + 1)
                return (
                  <div
                    key={i}
                    {...lineProps}
                    className={`${lineProps.className ?? ''} ${isHot ? '-mx-4 border-l-2 border-[#e8845c] bg-white/[0.045] px-4 pl-[14px]' : ''}`}
                  >
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                )
              })}
            </pre>
          )}
        </Highlight>
      )}
    </div>
  )
}

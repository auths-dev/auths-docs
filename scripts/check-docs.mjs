#!/usr/bin/env node
/**
 * The docs guardrails, encoded (the marketing-site lesson):
 *   1. copy lint      — banned vocabulary and the stray old package name
 *   2. verdict lint   — every verdict-shaped string must be one the source defines
 *   3. link check     — every internal link resolves to a page; external links
 *                       must not 404 (bot-blocks 403/429 are warnings)
 *   4. frontmatter    — the required contract on every page
 *
 * Run: node scripts/check-docs.mjs [--no-external]
 * Exits non-zero on any failure.
 */

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const CONTENT = path.join(ROOT, 'content/docs')
const checkExternal = !process.argv.includes('--no-external')

/** The exact verdict strings the gateway source defines — nothing else may appear. */
const VERDICTS = new Set([
  'allowed',
  'outside-agent-scope',
  'usage-cap-exceeded',
  'metered-amount-required',
  'usage-counter-rolled-back',
  'agent-expired',
  'revoked',
  'stale',
  'budget-required',
  'proof-unauthentic',
  'consistent',
  'tampered-proof',
  'cost-mismatch',
  'budget-mismatch',
  'dropped-call',
])

const BANNED = [
  { re: /blockchain|decentraliz|self-sovereign/i, why: 'category vocabulary' },
  { re: /\bKERI\b|\bCESR\b|did:keri/, why: 'protocol jargon' },
  { re: /\bseamless|\bleverag|\bempower|\brobust\b/i, why: 'hype vocabulary' },
  { re: /@auths\/mcp/, why: 'stray old package name (now @auths-dev/mcp)' },
]

const REQUIRED_FM = ['title', 'description', 'product', 'section', 'order', 'lastReviewed']

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : e.name.endsWith('.md') ? [p] : []
  })
}

const files = walk(CONTENT)
const slugs = new Set(
  files.map((f) => {
    const rel = path.relative(CONTENT, f).replace(/\.md$/, '')
    const segs = rel.split(path.sep)
    if (segs[segs.length - 1] === 'index') segs.pop()
    return '/docs/' + segs.join('/')
  })
)
slugs.add('/docs')

const failures = []
const warnings = []
const externalLinks = new Map()

for (const file of files) {
  const rel = path.relative(ROOT, file)
  const source = fs.readFileSync(file, 'utf8')

  // 4. frontmatter contract
  const fm = source.match(/^---\n([\s\S]*?)\n---/)
  const fmText = fm ? fm[1] : ''
  for (const field of REQUIRED_FM) {
    if (!new RegExp(`^${field}:`, 'm').test(fmText)) {
      failures.push(`${rel}: frontmatter missing "${field}"`)
    }
  }

  // 1. copy lint
  source.split('\n').forEach((line, i) => {
    for (const { re, why } of BANNED) {
      if (re.test(line)) failures.push(`${rel}:${i + 1}: ${why}: ${line.trim().slice(0, 80)}`)
    }
  })

  // 2. verdict lint — verdict tags, and verdict-position tokens in output fences
  for (const m of source.matchAll(/\{%\s*verdict\s+code="([^"]+)"/g)) {
    if (!VERDICTS.has(m[1])) failures.push(`${rel}: unknown verdict "${m[1]}" in verdict tag`)
  }
  for (const m of source.matchAll(/→\s+([a-z][a-z-]+[a-z])/g)) {
    const token = m[1]
    if (/-/.test(token) && !VERDICTS.has(token)) {
      failures.push(`${rel}: "${token}" reads as a verdict but the source defines no such string`)
    }
  }

  // 3. links
  for (const m of source.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const href = m[1]
    if (href.startsWith('#')) continue
    if (href.startsWith('/')) {
      const target = href.split('#')[0]
      if (!slugs.has(target)) failures.push(`${rel}: internal link ${target} resolves to no page`)
    } else if (href.startsWith('http')) {
      if (!externalLinks.has(href)) externalLinks.set(href, [])
      externalLinks.get(href).push(rel)
    } else {
      failures.push(`${rel}: relative link "${href}" — use root-relative /docs/... paths`)
    }
  }
}

if (checkExternal) {
  for (const [href, where] of externalLinks) {
    try {
      let res = await fetch(href, { method: 'HEAD', redirect: 'follow' })
      if (res.status === 405 || res.status === 403) {
        res = await fetch(href, { method: 'GET', redirect: 'follow' })
      }
      if (res.status === 403 || res.status === 429) {
        warnings.push(`external ${res.status} (bot-block?) ${href} (${where[0]})`)
      } else if (!res.ok) {
        failures.push(`external ${res.status} ${href} (${where[0]})`)
      }
    } catch (e) {
      failures.push(`external unreachable ${href} (${where[0]}): ${e.message}`)
    }
  }
}

for (const w of warnings) console.log(`warn  ${w}`)
if (failures.length > 0) {
  for (const f of failures) console.error(`FAIL  ${f}`)
  console.error(`\n${failures.length} failure(s) across ${files.length} pages`)
  process.exit(1)
}
console.log(`docs check clean — ${files.length} pages, ${externalLinks.size} external links`)

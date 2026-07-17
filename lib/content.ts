import fs from 'fs'
import path from 'path'
import Markdoc from '@markdoc/markdoc'
import * as yaml from 'js-yaml'

/**
 * The content layer: walks `content/docs/**.md`, enforces the frontmatter
 * contract, and derives the navigation from it — the nav can never disagree
 * with the files on disk.
 */

const CONTENT_DIR = path.join(process.cwd(), 'content/docs')

export interface DocFrontmatter {
  title: string
  description: string
  /** Which product world the page belongs to. */
  product: 'mcp' | 'identity'
  /** The sidebar section (eyebrow) the page lives under. */
  section: string
  /** Sort order within its section. */
  order: number
  badge?: 'new' | 'soon'
  /** ISO date the page was last reviewed against the product. */
  lastReviewed: string
}

export interface DocEntry {
  /** Slug segments relative to /docs, e.g. ['mcp', 'quickstart']. */
  slug: string[]
  href: string
  filePath: string
  frontmatter: DocFrontmatter
}

export interface NavItem {
  label: string
  href: string
  badge?: 'new' | 'soon'
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export interface ProductNav {
  product: 'mcp' | 'identity'
  label: string
  sections: NavSection[]
}

/** Section display order per product — the only hand-maintained nav input. */
const SECTION_ORDER: Record<'mcp' | 'identity', string[]> = {
  mcp: ['Get started', 'Core ideas', 'Spend real money'],
  identity: ['Guides', 'Concepts', 'Reference'],
}

const PRODUCT_LABEL: Record<'mcp' | 'identity', string> = {
  mcp: 'auths-mcp',
  identity: 'Identity & signing',
}

const REQUIRED_FIELDS = [
  'title',
  'description',
  'product',
  'section',
  'order',
  'lastReviewed',
] as const

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) return walk(p)
    return e.name.endsWith('.md') ? [p] : []
  })
}

/**
 * Parses and validates a doc file's frontmatter against the contract.
 * Throws (build-time) with the file path on any missing field — a page
 * without its contract never ships silently.
 */
function readFrontmatter(filePath: string): DocFrontmatter {
  const source = fs.readFileSync(filePath, 'utf8')
  const ast = Markdoc.parse(source)
  const fm = ast.attributes.frontmatter
    ? (yaml.load(ast.attributes.frontmatter) as Record<string, unknown>)
    : {}

  const missing = REQUIRED_FIELDS.filter((f) => fm[f] === undefined || fm[f] === '')
  if (missing.length > 0) {
    throw new Error(
      `frontmatter contract: ${path.relative(process.cwd(), filePath)} is missing [${missing.join(', ')}]`
    )
  }
  if (fm.product !== 'mcp' && fm.product !== 'identity') {
    throw new Error(
      `frontmatter contract: ${path.relative(process.cwd(), filePath)} has product="${String(fm.product)}" (must be "mcp" or "identity")`
    )
  }
  return fm as unknown as DocFrontmatter
}

function toSlug(filePath: string): string[] {
  const rel = path.relative(CONTENT_DIR, filePath).replace(/\.md$/, '')
  const segments = rel.split(path.sep)
  // index files collapse onto their directory: mcp/index.md → /docs/mcp
  if (segments[segments.length - 1] === 'index') segments.pop()
  return segments
}

/** Every doc on disk, contract-validated. Cached per server process. */
let cachedEntries: DocEntry[] | null = null

export function getAllDocs(): DocEntry[] {
  if (cachedEntries) return cachedEntries
  const entries = walk(CONTENT_DIR).map((filePath) => {
    const slug = toSlug(filePath)
    return {
      slug,
      href: `/docs/${slug.join('/')}`,
      filePath,
      frontmatter: readFrontmatter(filePath),
    }
  })
  cachedEntries = entries
  return entries
}

/** Resolve slug segments to a doc file, honoring index collapsing. */
export function getDocBySlug(slug: string[]): DocEntry | null {
  return getAllDocs().find((d) => d.slug.join('/') === slug.join('/')) ?? null
}

/**
 * The navigation, derived from frontmatter. auths-mcp leads; identity &
 * signing follows, demoted. Sections appear in SECTION_ORDER; pages sort by
 * `order` within a section.
 */
export function getNavigation(): ProductNav[] {
  const docs = getAllDocs()
  return (['mcp', 'identity'] as const).map((product) => {
    const inProduct = docs.filter((d) => d.frontmatter.product === product)
    const sectionNames = [
      ...SECTION_ORDER[product].filter((s) => inProduct.some((d) => d.frontmatter.section === s)),
      // any section not in the configured order still renders, at the end
      ...[...new Set(inProduct.map((d) => d.frontmatter.section))].filter(
        (s) => !SECTION_ORDER[product].includes(s)
      ),
    ]
    return {
      product,
      label: PRODUCT_LABEL[product],
      sections: sectionNames.map((title) => ({
        title,
        items: inProduct
          .filter((d) => d.frontmatter.section === title)
          .sort((a, b) => a.frontmatter.order - b.frontmatter.order)
          .map((d) => ({
            label: d.frontmatter.title,
            href: d.href,
            badge: d.frontmatter.badge,
          })),
      })),
    }
  })
}

/** The flattened reading order (mcp first), for prev/next. */
export function getPrevNext(href: string): { prev: NavItem | null; next: NavItem | null } {
  const flat = getNavigation().flatMap((p) =>
    p.sections.flatMap((s) => s.items.filter((i) => i.badge !== 'soon'))
  )
  const i = flat.findIndex((item) => item.href === href)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? flat[i - 1] : null,
    next: i < flat.length - 1 ? flat[i + 1] : null,
  }
}

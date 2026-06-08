import Markdoc, { RenderableTreeNode } from '@markdoc/markdoc'
import * as yaml from 'js-yaml'
import GithubSlugger from 'github-slugger'

export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

export interface ParsedDoc {
  content: RenderableTreeNode
  frontmatter: Record<string, unknown>
  toc: TocItem[]
}

const config = {}

/**
 * Add IDs to headings in HTML
 * @param html - Raw HTML string from Markdoc renderer
 * @returns HTML with IDs added to h2 and h3 tags
 */
function addHeadingIds(html: string): string {
  const slugger = new GithubSlugger()
  return html.replace(/<(h[2-3])([^>]*)>/g, (match, tag, attrs) => {
    // Extract text content from the next closing tag
    const closeTag = `</${tag}>`
    const closeIndex = html.indexOf(closeTag, html.indexOf(match) + match.length)
    const content = html.substring(html.indexOf(match) + match.length, closeIndex)
    const text = content.replace(/<[^>]*>/g, '') // Strip any nested tags
    const id = slugger.slug(text)

    // Check if id attr already exists
    if (attrs.includes('id=')) {
      return match
    }

    return `<${tag}${attrs} id="${id}">`
  })
}

/**
 * Parses a Markdoc source string into HTML, frontmatter, and TOC.
 * @param source - Raw markdown string from the .md file
 * @returns { html, frontmatter, toc }
 */
export function parseDoc(
  source: string
): { html: string; frontmatter: Record<string, unknown>; toc: TocItem[] } {
  const ast = Markdoc.parse(source)
  const frontmatter = ast.attributes.frontmatter
    ? (yaml.load(ast.attributes.frontmatter) as Record<string, unknown>)
    : {}

  // Extract TOC from AST
  const slugger = new GithubSlugger()
  const toc: TocItem[] = ast.children
    .filter((node) => node.type === 'heading' && [2, 3].includes(node.attributes.level))
    .map((node) => {
      const text = node.children
        .map((c: any) => (typeof c === 'string' ? c : c.attributes?.content ?? ''))
        .join('')
      return {
        id: slugger.slug(text),
        text,
        level: node.attributes.level as 2 | 3,
      }
    })

  const content = Markdoc.transform(ast, config)
  let html = Markdoc.renderers.html(content) || ''
  html = addHeadingIds(html)

  return { html, frontmatter, toc }
}

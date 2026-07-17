import Markdoc, { type RenderableTreeNode } from '@markdoc/markdoc'
import * as yaml from 'js-yaml'
import GithubSlugger from 'github-slugger'
import { buildConfig } from '@/markdoc/schema'

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

/**
 * Parses a Markdoc source string into a renderable tree (for
 * `Markdoc.renderers.react`), frontmatter, and TOC. Validation errors throw
 * at build time — an unknown tag never silently renders as nothing.
 */
export function parseDoc(source: string): ParsedDoc {
  const ast = Markdoc.parse(source)
  const frontmatter = ast.attributes.frontmatter
    ? (yaml.load(ast.attributes.frontmatter) as Record<string, unknown>)
    : {}

  const config = buildConfig()

  const errors = Markdoc.validate(ast, config).filter((e) => e.error.level === 'critical')
  if (errors.length > 0) {
    const detail = errors
      .map((e) => `${e.error.id ?? 'error'} at line ${e.lines?.[0] ?? '?'}: ${e.error.message}`)
      .join('\n  ')
    throw new Error(`Markdoc validation failed:\n  ${detail}`)
  }

  // TOC from the AST with its own slugger — same algorithm as the heading
  // node transform, so ids always match.
  const slugger = new GithubSlugger()
  const toc: TocItem[] = ast.children
    .filter((node) => node.type === 'heading' && [2, 3].includes(node.attributes.level))
    .map((node) => {
      let text = ''
      for (const child of node.walk()) {
        if (child.type === 'text' || child.type === 'code') {
          text += String(child.attributes.content ?? '')
        }
      }
      return {
        id: slugger.slug(text),
        text,
        level: node.attributes.level as 2 | 3,
      }
    })

  const content = Markdoc.transform(ast, config)

  return { content, frontmatter, toc }
}

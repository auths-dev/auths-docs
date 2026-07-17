import { Tag, type Config, type Node } from '@markdoc/markdoc'
import GithubSlugger from 'github-slugger'

/**
 * The Markdoc schema: nodes and tags transform into named components that
 * `Markdoc.renderers.react` resolves through the components map in
 * `lib/markdoc-components.tsx`. Content stays data; interactivity lives in
 * the components.
 */

function headingText(node: Node): string {
  let text = ''
  for (const child of node.walk()) {
    if (child.type === 'text' || child.type === 'code') {
      text += String(child.attributes.content ?? '')
    }
  }
  return text
}

/**
 * Builds a per-document config: the heading slugger is stateful, so each
 * document gets a fresh one (ids match the TOC extraction in lib/markdoc.ts).
 */
export function buildConfig(): Config {
  const slugger = new GithubSlugger()

  return {
    nodes: {
      heading: {
        children: ['inline'],
        attributes: {
          id: { type: String },
          level: { type: Number, required: true },
        },
        transform(node, config) {
          const attributes = node.transformAttributes(config)
          const children = node.transformChildren(config)
          const id = attributes.id ?? slugger.slug(headingText(node))
          return new Tag(`h${node.attributes.level}`, { ...attributes, id }, children)
        },
      },
      fence: {
        render: 'CodeBlock',
        attributes: {
          content: { type: String },
          language: { type: String },
          filename: { type: String },
          label: { type: String },
          highlight: { type: String },
        },
        transform(node, config) {
          const attributes = node.transformAttributes(config)
          return new Tag('CodeBlock', {
            ...attributes,
            content: node.attributes.content,
            language: node.attributes.language,
          })
        },
      },
    },
    tags: {
      callout: {
        render: 'Callout',
        children: ['paragraph', 'list', 'fence'],
        attributes: {
          type: {
            type: String,
            default: 'info',
            matches: ['info', 'warning', 'danger', 'success'],
          },
          title: { type: String },
        },
      },
      'card-group': {
        render: 'CardGroup',
        children: ['tag'],
      },
      card: {
        render: 'Card',
        children: ['paragraph', 'inline'],
        attributes: {
          title: { type: String, required: true },
          href: { type: String },
          icon: { type: String },
        },
      },
      steps: {
        render: 'Steps',
        children: ['tag'],
      },
      step: {
        render: 'Step',
        children: ['paragraph', 'list', 'fence', 'tag', 'heading'],
        attributes: {
          title: { type: String, required: true },
        },
      },
      'code-tabs': {
        render: 'CodeTabs',
        children: ['tag'],
      },
      'code-tab': {
        render: 'CodeTab',
        children: ['fence', 'paragraph'],
        attributes: {
          lang: { type: String, required: true },
          label: { type: String },
        },
      },
      verdict: {
        render: 'VerdictChip',
        selfClosing: true,
        attributes: {
          code: { type: String, required: true },
        },
      },
    },
  }
}

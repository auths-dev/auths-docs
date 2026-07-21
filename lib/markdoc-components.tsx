import React from 'react'
import Markdoc, { type RenderableTreeNode } from '@markdoc/markdoc'
import { CodeBlock } from '@/components/markdoc/CodeBlock'
import { Callout } from '@/components/markdoc/Callout'
import { Card, CardGroup } from '@/components/markdoc/Cards'
import { Steps, Step } from '@/components/markdoc/Steps'
import { CodeTabs, CodeTab } from '@/components/markdoc/CodeTabs'
import { VerdictChip } from '@/components/markdoc/VerdictChip'
import { HeadingAnchor } from '@/components/markdoc/HeadingAnchor'
import { WitnessAnchorLoop } from '@/components/markdoc/WitnessAnchorLoop'

/** The single map from Markdoc tag names to React components. */
const components = {
  CodeBlock,
  Callout,
  Card,
  CardGroup,
  Steps,
  Step,
  CodeTabs,
  CodeTab,
  VerdictChip,
  HeadingAnchor,
  WitnessAnchorLoop,
}

/** Renders a transformed Markdoc tree to React — no HTML strings, ever. */
export function renderDoc(content: RenderableTreeNode): React.ReactNode {
  return Markdoc.renderers.react(content, React, { components })
}

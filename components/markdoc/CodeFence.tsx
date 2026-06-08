'use client'

import { CodeBlock } from '@/components/CodeBlock'

interface CodeFenceProps {
  language?: string
  content: string
}

export function CodeFence({ language = 'bash', content }: CodeFenceProps) {
  return <CodeBlock language={language} content={content} />
}

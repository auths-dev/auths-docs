'use client'

import { Highlight, themes } from 'prism-react-renderer'

interface CodeBlockProps {
  language?: string
  content: string
}

export function CodeBlock({ language = 'bash', content }: CodeBlockProps) {
  return (
    <Highlight theme={themes.oneDark} code={content} language={language as any}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

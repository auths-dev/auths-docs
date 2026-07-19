import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllDocs, getDocBySlug, getPrevNext } from '@/lib/content'
import { parseDoc } from '@/lib/markdoc'
import { renderDoc } from '@/lib/markdoc-components'
import { DocsPrevNext } from '@/components/docs/DocsPrevNext'

/**
 * The one route for every doc page: content is data (`content/docs/**.md`),
 * metadata comes from frontmatter, and the nav can never drift from disk.
 */

type Props = { params: Promise<{ slug: string[] }> }

export function generateStaticParams() {
  return getAllDocs().map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = getDocBySlug(slug)
  if (!doc) return { title: 'Not found' }
  return {
    title: `${doc.frontmatter.title} — Auths docs`,
    description: doc.frontmatter.description,
  }
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params
  const doc = getDocBySlug(slug)
  if (!doc) notFound()

  const source = fs.readFileSync(doc.filePath, 'utf8')
  const { content } = parseDoc(source)
  const { prev, next } = getPrevNext(doc.href)

  const editUrl = `https://github.com/auths-dev/auths-docs/edit/main/${path
    .relative(process.cwd(), doc.filePath)
    .split(path.sep)
    .join('/')}`

  return (
    <article className="prose max-w-none [counter-reset:step]">
      <header className="not-prose mb-10">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-seal">
          {doc.frontmatter.section}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink">
          {doc.frontmatter.title}
        </h1>
        <p className="mt-3 text-lg leading-8 text-ink-soft">{doc.frontmatter.description}</p>
      </header>

      {renderDoc(content)}

      <footer className="not-prose mt-14 flex flex-wrap items-baseline justify-between gap-2 border-t border-rule pt-5">
        <a
          href={editUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[12px] text-ink-faint transition-colors hover:text-seal"
        >
          Edit this page
        </a>
        <span className="font-mono text-[12px] text-ink-faint">
          Last reviewed {doc.frontmatter.lastReviewed}
        </span>
      </footer>

      <DocsPrevNext prev={prev} next={next} />
    </article>
  )
}

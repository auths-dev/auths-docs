import fs from 'fs'
import path from 'path'
import { parseDoc } from '@/lib/markdoc'
import { DocsPrevNext } from '@/components/docs/DocsPrevNext'

interface PageProps {
  params: Promise<{ topic: string }>
}

export default async function Page(props: PageProps) {
  const { topic } = await props.params
  const filePath = path.join(process.cwd(), `content/docs/concepts/${topic}.md`)

  if (!fs.existsSync(filePath)) {
    return <div>Page not found</div>
  }

  const source = fs.readFileSync(filePath, 'utf8')
  const { html, frontmatter } = parseDoc(source)

  return (
    <article className="prose prose-gray max-w-none">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{frontmatter.title}</h1>
        <p className="text-lg text-gray-600">{frontmatter.description}</p>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <DocsPrevNext />
    </article>
  )
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content/docs/concepts')
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ topic: f.replace(/\.md$/, '') }))
}

export async function generateMetadata(props: PageProps) {
  const { topic } = await props.params
  const filePath = path.join(process.cwd(), `content/docs/concepts/${topic}.md`)
  if (!fs.existsSync(filePath)) return {}
  const source = fs.readFileSync(filePath, 'utf8')
  const { frontmatter } = parseDoc(source)
  return { title: `${frontmatter.title} - Auths Docs`, description: frontmatter.description }
}

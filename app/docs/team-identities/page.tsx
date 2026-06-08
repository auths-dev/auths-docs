import fs from 'fs'
import path from 'path'
import { parseDoc } from '@/lib/markdoc'
import { DocsPrevNext } from '@/components/docs/DocsPrevNext'

export default async function Page() {
  const source = fs.readFileSync(path.join(process.cwd(), 'content/docs/team-identities.md'), 'utf8')
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

export function generateMetadata() {
  return { title: 'Team Identities - Auths Docs', description: 'Manage multiple identities and signing keys for your team' }
}

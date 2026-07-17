import { redirect } from 'next/navigation'

/** The docs land on the product that leads: the bounded agent. */
export default function DocsIndex() {
  redirect('/docs/mcp')
}

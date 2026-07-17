import type { Metadata } from 'next'
import './globals.css'

const SEAL_FAVICON =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="%23c2401b"/></svg>'

export const metadata: Metadata = {
  title: 'Auths docs',
  description:
    'Bound an AI agent to a scope, a budget, and an expiry — and prove it with receipts anyone can verify.',
  icons: { icon: SEAL_FAVICON },
}

/** Applies the stored (or system) theme before paint — no flash. */
const THEME_SCRIPT = `
try {
  var t = localStorage.getItem('auths.docs.theme');
  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  )
}

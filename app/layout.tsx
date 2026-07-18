import type { Metadata } from 'next'
import { Fraunces } from 'next/font/google'
import './globals.css'

// The display face for the "Auths" wordmark — same font/axes as auths.dev and
// market.auths.dev. Exposed as --font-fraunces; `font-display` maps to it.
const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['opsz', 'SOFT', 'WONK'],
})

const SEAL_FAVICON =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="%23c2401b"/></svg>'

export const metadata: Metadata = {
  title: 'Auths docs',
  description:
    'Bound an AI agent to a scope, a budget, and an expiry — and prove it with receipts anyone can verify.',
  icons: { icon: SEAL_FAVICON },
}

/**
 * Applies the stored theme before paint — no flash. Defaults to light: dark is
 * used only when the visitor has explicitly toggled it (system preference is
 * not followed, so a dark-mode OS still lands on the light site by default).
 */
const THEME_SCRIPT = `
try {
  if (localStorage.getItem('auths.docs.theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fraunces.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  )
}

/**
 * Docs navigation structure and utilities for the sidebar and prev/next nav.
 */

export interface NavItem {
  label: string
  href: string
  badge?: 'soon' | 'new'
  items?: NavItem[]
}

export interface NavSection {
  title: string
  items: NavItem[]
}

/**
 * Navigation hierarchy for the docs site.
 * Used by DocsSidebar and DocsTopBar.
 */
export const docsNavigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Overview', href: '/docs' },
      { label: 'Installation', href: '/docs/installation' },
      { label: 'Authentication', href: '/docs/authentication' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { label: 'Sign Commits', href: '/docs/sign-commits' },
      { label: 'Team Identities', href: '/docs/team-identities' },
      { label: 'Build Agents', href: '/docs/build-agents' },
      { label: 'Prove Provenance', href: '/docs/prove-provenance' },
    ],
  },
  {
    title: 'Concepts',
    items: [
      { label: 'Identity Model', href: '/docs/concepts/identity-model', badge: 'soon' },
      { label: 'Key Rotation', href: '/docs/concepts/key-rotation', badge: 'soon' },
      { label: 'Delegation', href: '/docs/concepts/delegation', badge: 'soon' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { label: 'CLI Reference', href: '/docs/reference/cli', badge: 'soon' },
      { label: 'GitHub Actions', href: '/docs/reference/github-actions', badge: 'soon' },
    ],
  },
]

/**
 * Flattened navigation for prev/next computation.
 * Computed once at module level for efficient lookups.
 * @internal
 */
const FLATTENED_NAV = docsNavigation.flatMap((section) =>
  section.items.flatMap((item) => [item, ...(item.items ?? [])])
)

/**
 * Get the previous and next pages in the flattened nav sequence.
 * @param currentPath - The current page's URL path (e.g., '/docs/sign-commits')
 * @returns Object with `prev` and `next` NavItem or null if at boundaries
 * @example
 * const { prev, next } = getPrevNext('/docs/sign-commits')
 * // prev: { label: 'Installation', href: '/docs/installation' }
 * // next: { label: 'Team Identities', href: '/docs/team-identities' }
 */
export function getPrevNext(currentPath: string): {
  prev: NavItem | null
  next: NavItem | null
} {
  const currentIndex = FLATTENED_NAV.findIndex((item) => item.href === currentPath)

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: currentIndex > 0 ? FLATTENED_NAV[currentIndex - 1] : null,
    next: currentIndex < FLATTENED_NAV.length - 1 ? FLATTENED_NAV[currentIndex + 1] : null,
  }
}

/**
 * Check if a nav item is a placeholder (coming soon).
 * @param item - The nav item to check
 * @returns True if the item has badge 'soon'
 * @example
 * if (isPlaceholder(item)) {
 *   // Render as gray non-link with badge
 * }
 */
export function isPlaceholder(item: NavItem): boolean {
  return item.badge === 'soon'
}

/**
 * Get all nav items as a flat list (for static param generation, etc).
 * @returns Array of all nav items in the hierarchy
 * @example
 * const allItems = getAllNavItems()
 * const paths = allItems.map(item => item.href)
 */
export function getAllNavItems(): NavItem[] {
  return FLATTENED_NAV
}

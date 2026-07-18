/**
 * The clickable section anchor appended to every heading. Renders a link icon
 * (not a literal `#`) that appears on heading hover/keyboard-focus and links to
 * `#<id>`, so a reader can grab a shareable URL to the exact section. Visibility
 * and color live in `.heading-anchor` (app/globals.css).
 */
export function HeadingAnchor({ id }: { id: string }) {
  return (
    <a href={`#${id}`} className="heading-anchor" aria-label="Link to this section">
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 17H7A5 5 0 0 1 7 7h2" />
        <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
        <line x1="8" x2="16" y1="12" y2="12" />
      </svg>
    </a>
  )
}

import { DocsTopBar } from '@/components/docs/DocsTopBar'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { DocsMobileDrawer } from '@/components/docs/DocsMobileDrawer'
import { OnThisPage } from '@/components/docs/OnThisPage'
import { LanguageProvider } from '@/components/markdoc/language-context'
import { getNavigation } from '@/lib/content'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const nav = getNavigation()

  return (
    <LanguageProvider>
      <DocsTopBar />
      <div className="mx-auto max-w-[88rem]">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[270px_minmax(0,1fr)_260px] lg:gap-10">
          <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-rule bg-paper-deep/40 px-5 py-8 lg:block">
            <DocsSidebar nav={nav} />
          </aside>

          <main className="min-w-0 max-w-[72ch] px-6 py-10 sm:px-8 lg:px-0">{children}</main>

          <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] overflow-y-auto px-4 py-10 lg:block">
            <OnThisPage />
          </aside>
        </div>
      </div>

      <DocsMobileDrawer nav={nav} />
    </LanguageProvider>
  )
}

import { DocsTopBar } from '@/components/docs/DocsTopBar'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { CodeExamples } from '@/components/docs/CodeExamples'
import { DocsMobileDrawer } from '@/components/docs/DocsMobileDrawer'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DocsTopBar />
      <div className="flex-1">
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_320px] gap-0 lg:gap-8">
            {/* Left Sidebar */}
            <aside className="hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-6 py-8 border-r border-gray-200 bg-gray-50">
              <DocsSidebar />
            </aside>

            {/* Main Content */}
            <main className="min-w-0 px-6 sm:px-8 lg:px-0 py-8 max-w-2xl">
              {children}
            </main>

            {/* Right Sidebar (Code Examples) */}
            <aside className="hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-6 py-8 bg-white">
              <CodeExamples />
            </aside>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <DocsMobileDrawer />
    </>
  )
}

import { useSidebarManagerSnapshot } from 'state/sidebar-manager-state'
import { ResizableHandle, ResizablePanel, cn } from 'ui'

// Having these params as props as otherwise it's quite hard to visually check the sizes in DefaultLayout
// as react resizeable panels requires all these values to be valid to render correctly
interface LayoutSidebarProps {
  order?: number
  minSize?: number
  maxSize?: number
  defaultSize?: number
}

export const LayoutSidebar = ({
  order = 2,
  minSize = 30,
  maxSize = 50,
  defaultSize = 30,
}: LayoutSidebarProps) => {
  const { activeSidebar } = useSidebarManagerSnapshot()

  if (!activeSidebar?.component) return null

  return (
    <>
      <ResizableHandle withHandle />
      <ResizablePanel
        id="panel-side"
        key={activeSidebar?.id ?? 'default'}
        order={order}
        defaultSize={defaultSize}
        minSize={minSize}
        maxSize={maxSize}
        className={cn(
          'border-l bg',
          'relative border-l-0'
        )}
      >
        {activeSidebar?.component()}
      </ResizablePanel>
    </>
  )
}

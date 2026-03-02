import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { MainContent } from './MainContent'
import { RightSidebar } from './RightSidebar'

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MainContent
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onToggleProjects={() => setProjectsOpen((v) => !v)}
      />
      <RightSidebar isOpen={projectsOpen} onClose={() => setProjectsOpen(false)} />
    </div>
  )
}

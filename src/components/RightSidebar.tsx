import { MoreHorizontal, X } from 'lucide-react'

const PROJECTS = [
  { title: 'Learning From 100 Years o...', desc: 'For athletes, high altitude prod...' },
  { title: 'Research officiants', desc: "Maxwell's equations—the foun..." },
  { title: 'What does a senior lead de...', desc: 'Physiological respiration involv...' },
  { title: 'Write a sweet note to your...', desc: 'In the eighteenth century the G...' },
  { title: 'Meet with cake bakers', desc: 'Physical space is often conceiv...' },
  { title: 'Meet with cake bakers', desc: 'Physical space is often conceiv...' },
]

interface RightSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 xl:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed xl:static inset-y-0 right-0 z-50
          w-[280px] border-l border-[#f0f0f0] bg-white
          flex flex-col relative
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
          shrink-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5">
          <span className="text-xs font-semibold text-text-main">Projects (7)</span>
          <div className="flex items-center gap-2">
            <MoreHorizontal size={16} className="text-text-tertiary cursor-pointer" />
            <button onClick={onClose} className="xl:hidden text-text-tertiary">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto px-3">
          {/* New Project */}
          <div className="flex items-center justify-between px-3 py-3 border border-dashed border-[#f0f0f0] rounded-lg mb-3 cursor-pointer hover:border-gray-300 transition-colors">
            <span className="text-[13px] font-semibold text-text-main">New Project</span>
            <div className="w-4 h-4 rounded-full border border-[#f0f0f0] bg-[#fafafa] flex items-center justify-center text-gray-300 text-xs">
              -
            </div>
          </div>

          {/* Existing Projects */}
          {PROJECTS.map((project, i) => (
            <div
              key={i}
              className="relative px-3 py-3 border border-[#f0f0f0] rounded-lg mb-3 cursor-pointer hover:border-gray-300 transition-colors"
            >
              <div className="text-[13px] font-semibold text-text-main mb-1 truncate pr-6">
                {project.title}
              </div>
              <div className="text-xs text-text-tertiary truncate pr-6">
                {project.desc}
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-[#f0f0f0] bg-[#fafafa]" />
            </div>
          ))}
        </div>

        {/* FAB Button */}
        <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 shadow-[0_4px_12px_rgba(59,130,246,0.3)] flex items-center justify-center cursor-pointer hover:shadow-[0_6px_16px_rgba(59,130,246,0.4)] transition-shadow">
          <div className="w-4 h-4 bg-white rounded-full" />
        </div>
      </aside>
    </>
  )
}

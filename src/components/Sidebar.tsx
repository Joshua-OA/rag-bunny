import { useState } from 'react'
import {
  LayoutGrid,
  Search,
  FolderOpen,
  Folder,
  Type,
  FileText,
  Users,
  Clock,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  PanelLeftClose,
  Plus,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { icon: FolderOpen, label: 'AI Chat', active: true, filledWhenActive: true },
  { icon: Folder, label: 'Projects' },
  { icon: Type, label: 'Templates' },
  { icon: FileText, label: 'Documents', action: 'plus' as const },
  { icon: Users, label: 'Community', badge: 'NEW' as const },
  { icon: Clock, label: 'History' },
]

const SETTINGS_ITEMS = [
  { icon: Settings, label: 'Settings' },
  { icon: HelpCircle, label: 'Help' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeNav, setActiveNav] = useState('AI Chat')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[260px] bg-[#fcfcfc] border-r border-[#f0f0f0]
          flex flex-col py-4 px-3
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:flex shrink-0
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-3 mb-4">
          <div className="flex items-center gap-2.5 font-bold text-base text-text-main">
            <LayoutGrid size={20} className="text-text-main" />
            Script
          </div>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-secondary lg:block"
          >
            <PanelLeftClose size={20} className="hidden lg:block" />
            <X size={20} className="lg:hidden" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-white border border-[#f0f0f0] rounded-lg px-3 py-2 mb-6 mx-2">
          <Search size={16} className="text-text-secondary shrink-0" />
          <input
            type="text"
            placeholder="Search"
            className="border-none outline-none bg-transparent w-full ml-2 text-[13px] text-text-main placeholder:text-text-tertiary"
          />
          <span className="bg-[#f3f4f6] px-1.5 py-0.5 rounded text-[11px] text-text-tertiary shrink-0">
            ⌘K
          </span>
        </div>

        {/* Main Nav */}
        <nav className="mb-6">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.label
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                  text-sm font-medium cursor-pointer mb-0.5 transition-all
                  ${isActive
                    ? 'bg-white text-text-main shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#f0f0f0]'
                    : 'text-text-secondary hover:bg-bg-hover border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={isActive ? 'text-accent-blue' : 'text-text-tertiary'}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-accent-blue text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                    {item.badge}
                  </span>
                )}
                {item.action === 'plus' && (
                  <Plus size={14} className="text-text-tertiary" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Settings & Help */}
        <div className="text-[11px] text-text-tertiary uppercase tracking-wide mb-2 px-3 font-semibold">
          Settings & Help
        </div>
        <nav className="mb-6">
          {SETTINGS_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-hover cursor-pointer mb-0.5 transition-all"
              >
                <Icon size={18} className="text-text-tertiary" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-4">
          {/* Theme Toggle */}
          <div className="flex bg-[#f3f4f6] rounded-lg p-1 mx-2 mb-4">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-1.5 text-[13px] py-1.5 rounded-md cursor-pointer font-medium transition-all ${
                theme === 'light'
                  ? 'bg-white text-text-main shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                  : 'text-text-secondary'
              }`}
            >
              <Sun size={14} /> Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-1.5 text-[13px] py-1.5 rounded-md cursor-pointer font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-white text-text-main shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                  : 'text-text-secondary'
              }`}
            >
              <Moon size={14} /> Dark
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-text-main truncate">
                Emilia Caitlin
              </span>
              <span className="text-xs text-text-tertiary truncate">
                hey@unspace.agency
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

import { useState } from 'react'
import {
  Zap,
  HelpCircle,
  Gift,
  ToggleLeft,
  FileText,
  Sparkles,
  User,
  Code,
  Plus,
  SendHorizontal,
  Paperclip,
  Mic,
  LayoutGrid,
  Menu,
} from 'lucide-react'

const PROMPT_CARDS = [
  { icon: FileText, label: 'Write copy', bg: 'bg-orange-100', fg: 'text-orange-500' },
  { icon: Sparkles, label: 'Image generation', bg: 'bg-blue-100', fg: 'text-blue-500' },
  { icon: User, label: 'Create avatar', bg: 'bg-green-100', fg: 'text-green-500' },
  { icon: Code, label: 'Write code', bg: 'bg-pink-100', fg: 'text-pink-500' },
]

interface MainContentProps {
  onToggleSidebar: () => void
  onToggleProjects: () => void
}

export function MainContent({ onToggleSidebar, onToggleProjects }: MainContentProps) {
  const [inputValue, setInputValue] = useState('Summarize the latest')

  return (
    <main className="flex-1 bg-white flex flex-col min-w-0">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden text-text-secondary p-1"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-text-main">AI Chat</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="bg-[#111827] text-white border-none px-3 sm:px-4 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer">
            <Zap size={14} className="text-yellow-400" />
            <span className="hidden sm:inline">Upgrade</span>
          </button>
          <HelpCircle size={20} className="text-text-secondary cursor-pointer hidden sm:block" />
          <Gift size={20} className="text-text-secondary cursor-pointer hidden sm:block" />
          <ToggleLeft size={20} className="text-text-main cursor-pointer" />
          <button
            onClick={onToggleProjects}
            className="xl:hidden text-text-secondary p-1"
          >
            <LayoutGrid size={20} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-10 overflow-y-auto">
        <h1 className="text-2xl sm:text-[32px] font-bold text-text-main mb-3 text-center">
          Welcome to Script
        </h1>
        <p className="text-[15px] text-text-secondary mb-8 sm:mb-10 text-center max-w-md">
          Get started by Script a task and Chat can do the rest. Not sure where to start?
        </p>

        {/* Prompt Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-[560px] mb-10 sm:mb-16">
          {PROMPT_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className="flex items-center justify-between px-4 py-3 border border-[#f0f0f0] rounded-xl bg-white cursor-pointer hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bg}`}
                  >
                    <Icon size={18} className={card.fg} />
                  </div>
                  <span className="text-sm font-medium text-text-main">{card.label}</span>
                </div>
                <Plus size={16} className="text-text-tertiary" />
              </div>
            )
          })}
        </div>

        {/* Input Container */}
        <div className="w-full max-w-[760px] border border-[#f0f0f0] rounded-xl bg-white p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] mb-4">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything..."
              className="w-full border-none outline-none text-[15px] text-text-main bg-transparent"
            />
            <button className="bg-transparent border-none cursor-pointer text-text-main flex items-center justify-center ml-2 shrink-0">
              <SendHorizontal size={20} />
            </button>
          </div>
          <div className="flex items-center justify-between border-t border-[#f0f0f0] pt-3">
            <div className="flex gap-2 sm:gap-4 flex-wrap">
              <button className="flex items-center gap-1.5 text-text-secondary text-[13px] font-medium cursor-pointer bg-transparent border-none">
                <Paperclip size={16} />
                <span className="hidden sm:inline">Attach</span>
              </button>
              <button className="flex items-center gap-1.5 text-text-secondary text-[13px] font-medium cursor-pointer bg-transparent border-none">
                <Mic size={16} />
                <span className="hidden sm:inline">Voice Message</span>
              </button>
              <button className="flex items-center gap-1.5 text-text-secondary text-[13px] font-medium cursor-pointer bg-transparent border-none">
                <LayoutGrid size={16} />
                <span className="hidden sm:inline">Browse Prompts</span>
              </button>
            </div>
            <span className="text-xs text-text-tertiary shrink-0">
              {inputValue.length} / 3,000
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-text-tertiary pb-4">
          Script may generate inaccurate information about people, places, or facts. Model: Script AI v1.3.
        </p>
      </div>
    </main>
  )
}

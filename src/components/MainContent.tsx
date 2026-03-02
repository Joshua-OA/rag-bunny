import {
  Lightning,
  Question,
  Gift,
  ToggleLeft,
  FileText,
  Sparkle,
  User,
  Browser,
  Plus,
  PaperPlaneRight,
  Paperclip,
  Microphone,
  SquaresFour,
} from "@phosphor-icons/react";

const prompts = [
  { icon: FileText, label: "Write copy", bg: "bg-orange-100", color: "text-orange-500" },
  { icon: Sparkle, label: "Image generation", bg: "bg-blue-100", color: "text-blue-500" },
  { icon: User, label: "Create avatar", bg: "bg-green-100", color: "text-green-500" },
  { icon: Browser, label: "Write code", bg: "bg-pink-100", color: "text-pink-500" },
];

export default function MainContent() {
  return (
    <main className="flex-1 bg-white flex flex-col relative">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6">
        <div className="text-lg font-semibold text-main">AI Chat</div>
        <div className="flex items-center gap-4">
          <button className="bg-gray-900 text-white border-none px-4 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer">
            <Lightning size={16} weight="fill" className="text-yellow-400" />
            Upgrade
          </button>
          <Question size={20} className="text-secondary cursor-pointer" />
          <Gift size={20} className="text-secondary cursor-pointer" />
          <ToggleLeft size={20} weight="fill" className="text-main cursor-pointer" />
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 overflow-y-auto">
        <h1 className="text-[32px] font-bold text-main mb-3">Welcome to Script</h1>
        <p className="text-[15px] text-secondary mb-10">
          Get started by Script a task and Chat can do the rest. Not sure where to start?
        </p>

        {/* Prompt Cards */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-[560px] mb-15">
          {prompts.map((prompt) => (
            <div
              key={prompt.label}
              className="flex items-center justify-between px-4 py-3 border border-border rounded-xl bg-white cursor-pointer hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${prompt.bg} ${prompt.color}`}>
                  <prompt.icon size={18} weight="fill" />
                </div>
                <span className="text-sm font-medium text-main">{prompt.label}</span>
              </div>
              <Plus size={16} className="text-tertiary" />
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="w-full max-w-[760px] mx-auto mb-6 border border-border rounded-xl bg-white p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              defaultValue="Summarize the latest"
              placeholder="Ask anything..."
              className="w-full border-none outline-none text-[15px] text-main bg-transparent"
            />
            <button className="bg-transparent border-none cursor-pointer text-main text-xl flex items-center justify-center">
              <PaperPlaneRight size={20} />
            </button>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-secondary text-[13px] font-medium cursor-pointer">
                <Paperclip size={16} /> Attach
              </div>
              <div className="flex items-center gap-1.5 text-secondary text-[13px] font-medium cursor-pointer">
                <Microphone size={16} /> Voice Message
              </div>
              <div className="flex items-center gap-1.5 text-secondary text-[13px] font-medium cursor-pointer">
                <SquaresFour size={16} /> Browse Prompts
              </div>
            </div>
            <div className="text-xs text-tertiary">20 / 3,000</div>
          </div>
        </div>

        <div className="text-center text-xs text-tertiary pb-4">
          Script may generate inaccurate information about people, places, or facts. Model: Script AI v1.3.
        </div>
      </div>
    </main>
  );
}

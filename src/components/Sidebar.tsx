import {
  CirclesFour,
  SidebarSimple,
  MagnifyingGlass,
  Folder,
  FolderDashed,
  TextT,
  FileText,
  Users,
  ClockCounterClockwise,
  Gear,
  Question,
  Sun,
  Moon,
  Plus,
} from "@phosphor-icons/react";

const navItems = [
  { icon: Folder, label: "AI Chat", active: true, filled: true },
  { icon: FolderDashed, label: "Projects" },
  { icon: TextT, label: "Templates" },
  { icon: FileText, label: "Documents", rightIcon: Plus },
  { icon: Users, label: "Community", badge: "NEW" },
  { icon: ClockCounterClockwise, label: "History" },
];

const settingsItems = [
  { icon: Gear, label: "Settings" },
  { icon: Question, label: "Help" },
];

export default function Sidebar() {
  return (
    <aside className="w-[260px] bg-sidebar border-r border-border flex flex-col py-4 px-3">
      {/* Brand */}
      <div className="flex items-center justify-between px-3 mb-4">
        <div className="flex items-center gap-2.5 font-bold text-base text-main">
          <CirclesFour size={20} weight="fill" />
          Script
        </div>
        <SidebarSimple size={20} className="text-tertiary cursor-pointer" />
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border border-border rounded-lg px-3 py-2 mb-6 mx-2">
        <MagnifyingGlass size={16} className="text-secondary" />
        <input
          type="text"
          placeholder="Search"
          className="border-none outline-none bg-transparent w-full ml-2 text-[13px]"
        />
        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px] text-tertiary whitespace-nowrap">
          ⌘K
        </span>
      </div>

      {/* Main Nav */}
      <div className="mb-6">
        {navItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-0.5 cursor-pointer transition-all text-sm font-medium ${
              item.active
                ? "bg-white text-main shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-border"
                : "text-secondary hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon
                size={18}
                weight={item.filled ? "fill" : "regular"}
                className={item.active ? "text-accent-blue" : "text-tertiary"}
              />
              <span>{item.label}</span>
            </div>
            {item.rightIcon && (
              <item.rightIcon size={14} className="text-tertiary" />
            )}
            {item.badge && (
              <span className="bg-accent-blue text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Settings Label */}
      <div className="text-[11px] text-tertiary uppercase tracking-wide mb-2 px-3 font-semibold">
        Settings & Help
      </div>
      <div className="mb-6">
        {settingsItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary text-sm font-medium cursor-pointer hover:bg-gray-100 mb-0.5"
          >
            <item.icon size={18} className="text-tertiary" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="mt-auto pt-4">
        {/* Theme Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mx-2 mb-4">
          <div className="flex-1 flex items-center justify-center gap-1.5 text-[13px] py-1.5 rounded-md bg-white text-main shadow-sm font-medium cursor-pointer">
            <Sun size={16} /> Light
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 text-[13px] py-1.5 rounded-md text-secondary font-medium cursor-pointer">
            <Moon size={16} /> Dark
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://i.pravatar.cc/150?img=32')" }} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-main">Emilia Caitlin</span>
            <span className="text-xs text-tertiary">hey@unspace.agency</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

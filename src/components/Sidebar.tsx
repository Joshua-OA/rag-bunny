import { useState } from "react";
import {
  Rabbit,
  SidebarSimple,
  MagnifyingGlass,
  PlusCircle,
  ChatText,
  Sun,
  Moon,
  UserCircle,
} from "@phosphor-icons/react";
import type { Chat } from "../App";

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  theme: "light" | "dark";
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
}

function groupChatsByDate(chats: Chat[]) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
  const startOf7DaysAgo = new Date(startOfToday.getTime() - 7 * 86400000);

  const today: Chat[] = [];
  const yesterday: Chat[] = [];
  const previous7: Chat[] = [];
  const older: Chat[] = [];

  for (const chat of chats) {
    const created = new Date(chat.createdAt);
    if (created >= startOfToday) today.push(chat);
    else if (created >= startOfYesterday) yesterday.push(chat);
    else if (created >= startOf7DaysAgo) previous7.push(chat);
    else older.push(chat);
  }

  return { today, yesterday, previous7, older };
}

export default function Sidebar({
  chats,
  activeChatId,
  theme,
  onNewChat,
  onSelectChat,
  onToggleTheme,
  onToggleSidebar,
}: SidebarProps) {
  const [search, setSearch] = useState("");
  const isDark = theme === "dark";

  const filtered = search
    ? chats.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
    : chats;

  const grouped = groupChatsByDate(filtered);

  const renderChatGroup = (label: string, items: Chat[]) => {
    if (items.length === 0) return null;
    return (
      <>
        <div className={`text-[11px] uppercase tracking-wide mb-2 px-3 font-semibold ${isDark ? "text-gray-500" : "text-tertiary"}`}>
          {label}
        </div>
        <div className="mb-4">
          {items.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer mb-0.5 transition-all ${
                chat.id === activeChatId
                  ? isDark
                    ? "bg-gray-700 text-white"
                    : "bg-white text-main shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-border"
                  : isDark
                    ? "text-gray-400 hover:bg-gray-800"
                    : "text-secondary hover:bg-gray-100"
              }`}
            >
              <ChatText size={18} className={chat.id === activeChatId ? (isDark ? "text-white" : "text-accent-blue") : isDark ? "text-gray-500" : "text-tertiary"} />
              <span className="truncate">{chat.title}</span>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <aside className={`w-[260px] border-r flex flex-col py-4 px-3 transition-colors ${
      isDark ? "bg-gray-900 border-gray-800" : "bg-sidebar border-border"
    }`}>
      {/* Brand */}
      <div className="flex items-center justify-between px-3 mb-4">
        <div className={`flex items-center gap-2.5 font-bold text-base ${isDark ? "text-white" : "text-main"}`}>
          <Rabbit size={20} weight="fill" className={isDark ? "text-white" : "text-accent-blue"} />
          Rag Bunny
        </div>
        <SidebarSimple
          size={20}
          className={`cursor-pointer ${isDark ? "text-gray-500 hover:text-gray-300" : "text-tertiary hover:text-secondary"}`}
          onClick={onToggleSidebar}
        />
      </div>

      {/* Search */}
      <div className={`flex items-center rounded-lg px-3 py-2 mb-6 mx-2 border ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-border"
      }`}>
        <MagnifyingGlass size={16} className={isDark ? "text-gray-500" : "text-secondary"} />
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`border-none outline-none bg-transparent w-full ml-2 text-[13px] ${isDark ? "text-gray-300 placeholder:text-gray-600" : ""}`}
        />
        <span className={`px-1.5 py-0.5 rounded text-[11px] whitespace-nowrap ${isDark ? "bg-gray-700 text-gray-500" : "bg-gray-100 text-tertiary"}`}>
          ⌘K
        </span>
      </div>

      {/* New Chat */}
      <div className="mb-4">
        <div
          onClick={onNewChat}
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-0.5 cursor-pointer transition-all ${
            activeChatId === null
              ? isDark
                ? "bg-gray-700 text-white"
                : "bg-white text-main shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-border"
              : isDark
                ? "text-gray-400 hover:bg-gray-800"
                : "text-secondary hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <PlusCircle size={18} weight="fill" className={isDark ? "text-white" : "text-accent-blue"} />
            <span className="text-sm font-medium">New Chat</span>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {renderChatGroup("Today", grouped.today)}
        {renderChatGroup("Yesterday", grouped.yesterday)}
        {renderChatGroup("Previous 7 Days", grouped.previous7)}
        {renderChatGroup("Older", grouped.older)}
      </div>

      {/* Bottom */}
      <div className="mt-auto pt-4">
        {/* Theme Toggle */}
        <div className={`flex rounded-lg p-1 mx-2 mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
          <div
            onClick={() => theme === "dark" && onToggleTheme()}
            className={`flex-1 flex items-center justify-center gap-1.5 text-[13px] py-1.5 rounded-md font-medium cursor-pointer transition-all ${
              !isDark ? "bg-white text-main shadow-sm" : "text-gray-500"
            }`}
          >
            <Sun size={16} /> Light
          </div>
          <div
            onClick={() => theme === "light" && onToggleTheme()}
            className={`flex-1 flex items-center justify-center gap-1.5 text-[13px] py-1.5 rounded-md font-medium cursor-pointer transition-all ${
              isDark ? "bg-gray-700 text-white shadow-sm" : "text-secondary"
            }`}
          >
            <Moon size={16} /> Dark
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-2">
          <UserCircle size={32} weight="fill" className={isDark ? "text-gray-500" : "text-gray-400"} />
          <div className="flex flex-col">
            <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-main"}`}>Emilia Caitlin</span>
            <span className={`text-xs ${isDark ? "text-gray-500" : "text-tertiary"}`}>hey@unspace.agency</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

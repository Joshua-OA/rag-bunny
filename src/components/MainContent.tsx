import { useState, useRef, useEffect } from "react";
import {
  Question,
  PaperPlaneRight,
  Paperclip,
  SidebarSimple,
  Rabbit,
  UserCircle,
  FilePdf,
  FileText,
  Spinner,
  At,
  X,
  Wrench,
  CaretDown,
} from "@phosphor-icons/react";
import type { Chat, PdfFile } from "../App";
import type { Citation, ToolCall } from "../api";

interface MainContentProps {
  chat: Chat | null;
  theme: "light" | "dark";
  sidebarOpen: boolean;
  isLoading: boolean;
  hasProcessedDocs: boolean;
  processedPdfs: PdfFile[];
  selectedPdf: PdfFile | null;
  onSelectPdf: (pdfId: string | null) => void;
  onSendMessage: (content: string) => void;
  onUploadPdf: (file: File) => void;
  onToggleSidebar: () => void;
}

function CitationCard({ citation, isDark }: { citation: Citation; isDark: boolean }) {
  return (
    <div
      className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs ${
        isDark
          ? "border-gray-700 bg-gray-800/50"
          : "border-border bg-gray-50"
      }`}
    >
      <FilePdf size={16} className="text-red-500 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className={`font-semibold truncate ${isDark ? "text-gray-300" : "text-main"}`}>
          {citation.document}
          {citation.page > 0 && (
            <span className={`font-normal ml-1 ${isDark ? "text-gray-500" : "text-tertiary"}`}>
              p.{citation.page}
            </span>
          )}
        </div>
        <div className={`mt-1 leading-relaxed line-clamp-2 ${isDark ? "text-gray-400" : "text-secondary"}`}>
          {citation.snippet}
        </div>
      </div>
    </div>
  );
}

function ToolCallsSection({ toolCalls, isDark }: { toolCalls: ToolCall[]; isDark: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-1.5 text-xs font-semibold bg-transparent border-none cursor-pointer p-0 ${
          isDark ? "text-gray-500 hover:text-gray-400" : "text-tertiary hover:text-secondary"
        }`}
      >
        <Wrench size={14} />
        {toolCalls.length} tool{toolCalls.length > 1 ? "s" : ""} used
        <CaretDown size={12} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div className="mt-2 space-y-2">
          {toolCalls.map((tc, i) => (
            <div
              key={i}
              className={`p-2.5 rounded-lg border text-xs ${
                isDark ? "border-gray-700 bg-gray-800/50" : "border-border bg-gray-50"
              }`}
            >
              <div className={`font-semibold ${isDark ? "text-gray-300" : "text-main"}`}>
                {tc.tool_name}
              </div>
              <div className={`mt-1 font-mono text-[11px] leading-relaxed ${isDark ? "text-gray-500" : "text-tertiary"}`}>
                {JSON.stringify(tc.args)}
              </div>
              <div className={`mt-1.5 leading-relaxed line-clamp-3 ${isDark ? "text-gray-400" : "text-secondary"}`}>
                {tc.result}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const LOADING_STEPS = [
  "Thinking...",
  "Checking calendar...",
  "Checking emails...",
  "Searching documents...",
  "Analyzing results...",
  "Putting it all together...",
];

function LoadingStatus() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1 < LOADING_STEPS.length ? s + 1 : s));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1">
      {LOADING_STEPS.slice(0, step + 1).map((text, i) => (
        <div
          key={text}
          className={`flex items-center gap-2 text-sm transition-opacity duration-300 ${
            i < step ? "opacity-50" : "opacity-100"
          }`}
        >
          {i === step ? (
            <Spinner size={14} className="animate-spin shrink-0" />
          ) : (
            <span className="text-green-500 shrink-0 text-xs">✓</span>
          )}
          {text}
        </div>
      ))}
    </div>
  );
}

function isTxt(name: string) {
  return name.toLowerCase().endsWith(".txt");
}

export default function MainContent({
  chat,
  theme,
  sidebarOpen,
  isLoading,
  hasProcessedDocs,
  processedPdfs,
  selectedPdf,
  onSelectPdf,
  onSendMessage,
  onUploadPdf,
  onToggleSidebar,
}: MainContentProps) {
  const [input, setInput] = useState("");
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [mentionIndex, setMentionIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mentionMenuRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  const chatDisabled = isLoading;

  const filteredMentionPdfs = processedPdfs.filter((p) =>
    p.name.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages.length, isLoading]);

  // Reset mention index when filter changes
  useEffect(() => {
    setMentionIndex(0);
  }, [mentionFilter]);

  // Close mention menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        mentionMenuRef.current &&
        !mentionMenuRef.current.contains(e.target as Node)
      ) {
        setShowMentionMenu(false);
      }
    }
    if (showMentionMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMentionMenu]);

  const handleSelectMention = (pdf: PdfFile) => {
    onSelectPdf(pdf.id);
    // Remove the @query from input
    const atIdx = input.lastIndexOf("@");
    const before = atIdx >= 0 ? input.slice(0, atIdx) : input;
    setInput(before);
    setShowMentionMenu(false);
    setMentionFilter("");
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    // Detect @ trigger
    const atIdx = val.lastIndexOf("@");
    if (atIdx >= 0 && processedPdfs.length > 0) {
      const query = val.slice(atIdx + 1);
      // Only show menu if @ is at start or preceded by a space
      if (atIdx === 0 || val[atIdx - 1] === " ") {
        setMentionFilter(query);
        setShowMentionMenu(true);
        return;
      }
    }
    setShowMentionMenu(false);
  };

  const handleSubmit = () => {
    if (!input.trim() || chatDisabled) return;
    onSendMessage(input.trim());
    setInput("");
    setShowMentionMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentionMenu && filteredMentionPdfs.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionIndex((i) => (i + 1) % filteredMentionPdfs.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionIndex((i) => (i - 1 + filteredMentionPdfs.length) % filteredMentionPdfs.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        handleSelectMention(filteredMentionPdfs[mentionIndex]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowMentionMenu(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === "application/pdf" || file.type === "text/plain")
    ) {
      onUploadPdf(file);
    }
    e.target.value = "";
  };

  const charCount = input.length;

  const placeholderText = "Ask anything... (type @ to select a doc for targeted answers)";

  return (
    <main className={`flex-1 flex flex-col relative transition-colors ${isDark ? "bg-gray-950" : "bg-white"}`}>
      {/* Header */}
      <header className={`h-16 flex items-center justify-between px-6 border-b ${isDark ? "border-gray-800" : "border-transparent"}`}>
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <SidebarSimple
              size={20}
              className={`cursor-pointer ${isDark ? "text-gray-500 hover:text-gray-300" : "text-tertiary hover:text-secondary"}`}
              onClick={onToggleSidebar}
            />
          )}
          <div className={`text-lg font-semibold ${isDark ? "text-white" : "text-main"}`}>AI Chat</div>
        </div>
        <div className="flex items-center gap-4">
          <Question size={20} className={`cursor-pointer ${isDark ? "text-gray-500" : "text-secondary"}`} />
        </div>
      </header>

      {/* Chat Area */}
      {!chat ? (
        /* Welcome Screen */
        <div className="flex-1 flex flex-col items-center justify-center px-10 overflow-y-auto">
          <div className={`mb-4 ${isDark ? "text-white" : "text-accent-blue"}`}>
            <Rabbit size={48} weight="fill" />
          </div>
          <h1 className={`text-[32px] font-bold mb-3 ${isDark ? "text-white" : "text-main"}`}>Welcome to Rag Bunny</h1>
          <p className={`text-[15px] mb-10 ${isDark ? "text-gray-400" : "text-secondary"}`}>
            Upload your PDFs and ask questions. Rag Bunny will find the answers for you.
          </p>
        </div>
      ) : (
        /* Messages */
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-[760px] mx-auto space-y-6">
            {chat.messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="shrink-0 mt-1">
                  {msg.role === "user" ? (
                    <UserCircle size={28} weight="fill" className={isDark ? "text-gray-500" : "text-gray-400"} />
                  ) : (
                    <Rabbit size={28} weight="fill" className={isDark ? "text-white" : "text-accent-blue"} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold mb-1 ${isDark ? "text-white" : "text-main"}`}>
                    {msg.role === "user" ? "You" : "Rag Bunny"}
                  </div>
                  <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? "text-gray-300" : "text-secondary"}`}>
                    {msg.content}
                  </div>
                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className={`text-xs font-semibold ${isDark ? "text-gray-500" : "text-tertiary"}`}>
                        Sources
                      </div>
                      {msg.citations.map((c, i) => (
                        <CitationCard key={i} citation={c} isDark={isDark} />
                      ))}
                    </div>
                  )}
                  {/* Tool calls */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <ToolCallsSection toolCalls={msg.toolCalls} isDark={isDark} />
                  )}
                  {/* Confidence badge */}
                  {msg.confidence && (
                    <div className={`mt-2 inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      msg.confidence === "high"
                        ? "bg-green-100 text-green-700"
                        : msg.confidence === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}>
                      {msg.confidence} confidence
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="shrink-0 mt-1">
                  <Rabbit size={28} weight="fill" className={isDark ? "text-white" : "text-accent-blue"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold mb-1 ${isDark ? "text-white" : "text-main"}`}>Rag Bunny</div>
                  <div className={isDark ? "text-gray-400" : "text-secondary"}>
                    <LoadingStatus />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 pb-4">
        <div className={`w-full max-w-[760px] mx-auto border rounded-xl p-4 transition-colors relative ${
          isDark ? "bg-gray-900 border-gray-700 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)]" : "bg-white border-border shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
        }`}>
          {/* Selected document badge */}
          {selectedPdf && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                isDark ? "bg-gray-800 text-gray-300 border border-gray-700" : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}>
                {isTxt(selectedPdf.name) ? (
                  <FileText size={14} className="text-blue-500" />
                ) : (
                  <FilePdf size={14} className="text-red-500" />
                )}
                {selectedPdf.name}
                <button
                  onClick={() => onSelectPdf(null)}
                  className={`ml-0.5 bg-transparent border-none cursor-pointer p-0 ${
                    isDark ? "text-gray-500 hover:text-gray-300" : "text-blue-400 hover:text-blue-600"
                  }`}
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          {/* @ mention dropdown */}
          {showMentionMenu && filteredMentionPdfs.length > 0 && (
            <div
              ref={mentionMenuRef}
              className={`absolute bottom-full left-4 mb-2 w-72 max-h-48 overflow-y-auto rounded-xl border shadow-lg z-10 ${
                isDark ? "bg-gray-800 border-gray-700" : "bg-white border-border"
              }`}
            >
              <div className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wide ${isDark ? "text-gray-500" : "text-tertiary"}`}>
                Select a document
              </div>
              {filteredMentionPdfs.map((pdf, i) => (
                <div
                  key={pdf.id}
                  onClick={() => handleSelectMention(pdf)}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition-colors ${
                    i === mentionIndex
                      ? isDark
                        ? "bg-gray-700 text-white"
                        : "bg-blue-50 text-main"
                      : isDark
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-secondary hover:bg-gray-50"
                  }`}
                >
                  {isTxt(pdf.name) ? (
                    <FileText size={16} className="text-blue-500 shrink-0" />
                  ) : (
                    <FilePdf size={16} className="text-red-500 shrink-0" />
                  )}
                  <span className="truncate">{pdf.name}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholderText}
              disabled={isLoading}
              className={`w-full border-none outline-none text-[15px] bg-transparent ${isDark ? "text-white placeholder:text-gray-600" : "text-main"} ${chatDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || chatDisabled}
              className={`bg-transparent border-none cursor-pointer text-xl flex items-center justify-center transition-colors ${
                input.trim() && !chatDisabled
                  ? isDark ? "text-white" : "text-accent-blue"
                  : isDark ? "text-gray-600" : "text-gray-300"
              }`}
            >
              <PaperPlaneRight size={20} />
            </button>
          </div>
          <div className={`flex items-center justify-between border-t pt-3 ${isDark ? "border-gray-700" : "border-border"}`}>
            <div className="flex gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-1.5 text-[13px] font-medium cursor-pointer ${isDark ? "text-gray-400 hover:text-gray-200" : "text-secondary hover:text-main"}`}
              >
                <Paperclip size={16} /> Attach
              </div>
              {hasProcessedDocs && (
                <div
                  onClick={() => {
                    if (!chatDisabled) {
                      setShowMentionMenu(true);
                      setMentionFilter("");
                      inputRef.current?.focus();
                    }
                  }}
                  className={`flex items-center gap-1.5 text-[13px] font-medium cursor-pointer ${
                    chatDisabled
                      ? isDark ? "text-gray-600" : "text-gray-300"
                      : isDark ? "text-gray-400 hover:text-gray-200" : "text-secondary hover:text-main"
                  }`}
                >
                  <At size={16} /> Mention
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className={`text-xs ${isDark ? "text-gray-600" : "text-tertiary"}`}>{charCount} / 3,000</div>
          </div>
        </div>

        <div className={`text-center text-xs pt-3 ${isDark ? "text-gray-600" : "text-tertiary"}`}>
          Rag Bunny may generate inaccurate information. Always verify against your source documents.
        </div>
      </div>
    </main>
  );
}

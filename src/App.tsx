import { useState, useCallback, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import ProjectsSidebar from "./components/ProjectsSidebar";
import { ToastProvider, useToast } from "./components/Toast";
import { uploadDocument, askQuestion, fetchDocuments } from "./api";
import type { Citation } from "./api";
import "./index.css";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  confidence?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface PdfFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  documentId?: string;
  chunksCreated?: number;
  status?: "uploading" | "processed" | "error";
}

function AppInner() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPdfId, setSelectedPdfId] = useState<string | null>(null);
  const { toast } = useToast();

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;
  const processedPdfs = pdfs.filter((p) => p.status === "processed");
  const hasProcessedDocs = processedPdfs.length > 0;
  const selectedPdf = pdfs.find((p) => p.id === selectedPdfId) ?? null;

  // Load existing documents from the backend on mount
  useEffect(() => {
    fetchDocuments()
      .then((data) => {
        console.log("[fetchDocuments] response:", data);
        const formatSize = (bytes: number) =>
          bytes > 1024 * 1024
            ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
            : `${(bytes / 1024).toFixed(0)} KB`;

        const existing: PdfFile[] = data.documents.map((doc) => ({
          id: `pdf-${doc.document_id}`,
          name: doc.filename,
          size: formatSize(doc.file_size),
          uploadedAt: "Previously",
          documentId: doc.document_id,
          chunksCreated: doc.chunks_created,
          status: "processed" as const,
        }));
        setPdfs((prev) => {
          const currentIds = new Set(prev.map((p) => p.documentId));
          const newDocs = existing.filter((d) => !currentIds.has(d.documentId));
          return [...prev, ...newDocs];
        });
      })
      .catch(() => {
        // Silently fail — user can still upload new docs
      });
  }, []);

  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
  }, []);

  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
  }, []);

  const handleSelectPdf = useCallback((pdfId: string | null) => {
    setSelectedPdfId(pdfId);
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || !hasProcessedDocs) return;

      const userMsg: Message = {
        id: `m${Date.now()}`,
        role: "user",
        content: selectedPdf
          ? `@${selectedPdf.name} ${content}`
          : content,
      };

      let chatId = activeChatId;

      if (chatId) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages: [...chat.messages, userMsg] }
              : chat
          )
        );
      } else {
        chatId = `chat-${Date.now()}`;
        const title = content.length > 40 ? content.slice(0, 40) + "..." : content;
        const newChat: Chat = {
          id: chatId,
          title,
          messages: [userMsg],
          createdAt: new Date(),
        };
        setChats((prev) => [newChat, ...prev]);
        setActiveChatId(chatId);
      }

      setIsLoading(true);

      try {
        const docId = selectedPdf?.documentId ?? undefined;
        console.log("[askQuestion] query:", content, "| document_id:", docId ?? "(all docs)");

        const data = await askQuestion(content, docId);
        console.log("[askQuestion] response:", data);

        const assistantMsg: Message = {
          id: `m${Date.now() + 1}`,
          role: "assistant",
          content: data.answer,
          citations: data.citations,
          confidence: data.confidence,
        };

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages: [...chat.messages, assistantMsg] }
              : chat
          )
        );
      } catch (err) {
        const isNetwork =
          err instanceof TypeError && err.message.includes("fetch");

        toast(
          "error",
          isNetwork
            ? "Couldn't reach the server. Please check your connection and try again."
            : "We couldn't get an answer right now. Please try again in a moment."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeChatId, isLoading, toast, hasProcessedDocs, selectedPdf]
  );

  const handleUploadPdf = useCallback(
    async (file: File) => {
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`;
      const now = new Date();
      const month = now.toLocaleString("en", { month: "short" });
      const day = now.getDate();

      const tempId = `pdf-${Date.now()}`;
      const placeholderPdf: PdfFile = {
        id: tempId,
        name: file.name,
        size: sizeStr,
        uploadedAt: `${month} ${day}`,
        status: "uploading",
      };

      setPdfs((prev) => [placeholderPdf, ...prev]);

      try {
        const data = await uploadDocument(file);

        setPdfs((prev) =>
          prev.map((p) =>
            p.id === tempId
              ? {
                  ...p,
                  documentId: data.document_id,
                  chunksCreated: data.chunks_created,
                  status: "processed" as const,
                }
              : p
          )
        );

        toast("success", `"${file.name}" uploaded and processed successfully!`);
      } catch (err) {
        setPdfs((prev) =>
          prev.map((p) =>
            p.id === tempId ? { ...p, status: "error" as const } : p
          )
        );

        const isNetwork =
          err instanceof TypeError && err.message.includes("fetch");

        toast(
          "error",
          isNetwork
            ? `Couldn't upload "${file.name}". Please check your connection and try again.`
            : `Something went wrong uploading "${file.name}". Please try again.`
        );
      }
    },
    [toast]
  );

  const handleDeletePdf = useCallback(
    (pdfId: string) => {
      if (selectedPdfId === pdfId) setSelectedPdfId(null);
      setPdfs((prev) => prev.filter((p) => p.id !== pdfId));
    },
    [selectedPdfId]
  );

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div
      className={`h-screen flex overflow-hidden transition-colors ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      {sidebarOpen && (
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          theme={theme}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onToggleTheme={handleToggleTheme}
          onToggleSidebar={handleToggleSidebar}
        />
      )}
      <MainContent
        chat={activeChat}
        theme={theme}
        sidebarOpen={sidebarOpen}
        isLoading={isLoading}
        hasProcessedDocs={hasProcessedDocs}
        processedPdfs={processedPdfs}
        selectedPdf={selectedPdf}
        onSelectPdf={handleSelectPdf}
        onSendMessage={handleSendMessage}
        onUploadPdf={handleUploadPdf}
        onToggleSidebar={handleToggleSidebar}
      />
      <ProjectsSidebar
        pdfs={pdfs}
        theme={theme}
        selectedPdfId={selectedPdfId}
        onSelectPdf={handleSelectPdf}
        onDeletePdf={handleDeletePdf}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}

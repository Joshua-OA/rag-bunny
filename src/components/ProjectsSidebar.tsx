import { DotsThree, FilePdf, FileText, Trash, Spinner, WarningCircle, CheckCircle } from "@phosphor-icons/react";
import { useState } from "react";
import type { PdfFile } from "../App";

interface ProjectsSidebarProps {
  pdfs: PdfFile[];
  theme: "light" | "dark";
  selectedPdfId: string | null;
  onSelectPdf: (pdfId: string | null) => void;
  onDeletePdf: (pdfId: string) => void;
}

export default function ProjectsSidebar({ pdfs, theme, selectedPdfId, onSelectPdf, onDeletePdf }: ProjectsSidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isDark = theme === "dark";

  const isTxt = (name: string) => name.toLowerCase().endsWith(".txt");

  const handleClick = (pdf: PdfFile) => {
    if (pdf.status !== "processed") return;
    onSelectPdf(selectedPdfId === pdf.id ? null : pdf.id);
  };

  return (
    <aside className={`w-[280px] border-l flex flex-col relative transition-colors ${
      isDark ? "bg-gray-900 border-gray-800" : "bg-white border-border"
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-5 border-b ${isDark ? "border-gray-800" : "border-transparent"}`}>
        <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-main"}`}>
          Uploaded Documents ({pdfs.length})
        </span>
        <DotsThree size={20} className={`cursor-pointer ${isDark ? "text-gray-500" : "text-tertiary"}`} />
      </div>

      {/* PDF List */}
      <div className="flex-1 overflow-y-auto px-3 pt-3">
        {pdfs.length === 0 ? (
          <div className={`text-center py-10 text-sm ${isDark ? "text-gray-600" : "text-tertiary"}`}>
            No documents uploaded yet.<br />Use the Attach button to upload.
          </div>
        ) : (
          pdfs.map((pdf) => {
            const isSelected = selectedPdfId === pdf.id;
            const isProcessed = pdf.status === "processed";

            return (
              <div
                key={pdf.id}
                onClick={() => handleClick(pdf)}
                onMouseEnter={() => setHoveredId(pdf.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`p-3 border rounded-lg mb-3 relative transition-colors ${
                  isProcessed ? "cursor-pointer" : "cursor-default"
                } ${
                  isSelected
                    ? isDark
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-blue-400 bg-blue-50"
                    : pdf.status === "error"
                      ? isDark
                        ? "border-red-800 hover:border-red-700"
                        : "border-red-200 hover:border-red-300"
                      : isDark
                        ? "border-gray-700 hover:border-gray-600"
                        : "border-border hover:border-gray-300"
                }`}
              >
                <div className={`text-[13px] font-semibold mb-1 truncate pr-6 flex items-center gap-1.5 ${isDark ? "text-white" : "text-main"}`}>
                  {pdf.status === "uploading" ? (
                    <Spinner size={16} className="animate-spin text-blue-500 shrink-0" />
                  ) : pdf.status === "error" ? (
                    <WarningCircle size={16} className="text-red-500 shrink-0" />
                  ) : isTxt(pdf.name) ? (
                    <FileText size={16} className="text-blue-500 shrink-0" />
                  ) : (
                    <FilePdf size={16} className="text-red-500 shrink-0" />
                  )}
                  {pdf.name}
                </div>
                <div className={`text-xs truncate ${isDark ? "text-gray-500" : "text-tertiary"}`}>
                  {pdf.status === "uploading" ? (
                    "Uploading..."
                  ) : pdf.status === "error" ? (
                    <span className="text-red-500">Upload failed</span>
                  ) : (
                    <>
                      {pdf.size} — Uploaded {pdf.uploadedAt}
                      {pdf.chunksCreated != null && (
                        <span> — {pdf.chunksCreated} chunks</span>
                      )}
                    </>
                  )}
                </div>

                {/* Right indicator */}
                {hoveredId === pdf.id && !isSelected ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePdf(pdf.id);
                    }}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 ${
                      isDark ? "text-gray-500 hover:text-red-400" : "text-tertiary hover:text-red-500"
                    }`}
                  >
                    <Trash size={16} />
                  </button>
                ) : isSelected ? (
                  <CheckCircle
                    size={18}
                    weight="fill"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "text-blue-400" : "text-blue-500"}`}
                  />
                ) : (
                  <div className={`w-4 h-4 rounded-full border absolute right-3 top-1/2 -translate-y-1/2 ${
                    isDark ? "border-gray-700 bg-gray-800" : "border-border bg-gray-50"
                  }`} />
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

import { createContext, useCallback, useContext, useState } from "react";
import { X, CheckCircle, WarningCircle, Info } from "@phosphor-icons/react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 5000;

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, message: string) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => removeToast(id), TOAST_DURATION);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const icon =
    toast.type === "success" ? (
      <CheckCircle size={20} weight="fill" className="text-green-500 shrink-0" />
    ) : toast.type === "error" ? (
      <WarningCircle size={20} weight="fill" className="text-red-500 shrink-0" />
    ) : (
      <Info size={20} weight="fill" className="text-blue-500 shrink-0" />
    );

  const borderColor =
    toast.type === "success"
      ? "border-green-200"
      : toast.type === "error"
        ? "border-red-200"
        : "border-blue-200";

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 min-w-[320px] max-w-[420px] px-4 py-3 rounded-xl border bg-white shadow-lg animate-slide-in ${borderColor}`}
    >
      {icon}
      <p className="text-sm text-gray-700 flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="shrink-0 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0"
      >
        <X size={16} />
      </button>
    </div>
  );
}

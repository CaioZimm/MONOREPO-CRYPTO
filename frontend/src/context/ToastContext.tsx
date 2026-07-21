import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl shadow-2xl backdrop-blur-xl border transition-all duration-300 animate-fade-in ${
              toast.type === "success"
                ? "bg-zinc-900/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40"
                : toast.type === "error"
                ? "bg-zinc-900/90 border-red-500/40 text-red-200 shadow-red-950/40"
                : "bg-zinc-900/90 border-cyan-500/40 text-cyan-200 shadow-cyan-950/40"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" && <FiCheckCircle className="text-emerald-400 w-5 h-5 shrink-0" />}
              {toast.type === "error" && <FiAlertCircle className="text-red-400 w-5 h-5 shrink-0" />}
              {toast.type === "info" && <FiInfo className="text-cyan-400 w-5 h-5 shrink-0" />}
              <p className="text-sm font-medium text-zinc-100">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-zinc-200 transition-colors p-1 cursor-pointer"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

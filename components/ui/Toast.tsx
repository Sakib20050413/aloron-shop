"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";
interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  action?: { label: string; href: string };
}

const ToastContext = createContext<{ showToast: (msg: Omit<ToastMessage, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (msg: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...msg, id }]);
  };

  useEffect(() => {
    if (!toasts.length) return;
    const timer = setTimeout(() => setToasts((prev) => prev.slice(1)), 3000);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-24 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 md:bottom-8 md:left-auto md:right-8 md:translate-x-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="pointer-events-auto flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
            >
              {toast.type === "success" && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
              {toast.type === "error" && <AlertTriangle size={16} className="text-rose-500 shrink-0" />}
              {toast.type === "info" && <Info size={16} className="text-neutral-700 dark:text-neutral-300 shrink-0" />}
              <span className="flex-1 text-xs font-semibold text-neutral-900 dark:text-white">{toast.message}</span>
              {toast.action && (
                <a
                  href={toast.action.href}
                  className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 underline underline-offset-4 hover:opacity-80 dark:text-white"
                >
                  {toast.action.label}
                </a>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

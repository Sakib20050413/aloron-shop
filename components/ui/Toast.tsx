"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";
interface ToastMessage { id: string; type: ToastType; message: string; action?: { label: string; href: string } }

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
            <motion.div key={toast.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="pointer-events-auto flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-[#0B0F19]">
              {toast.type === "success" && <CheckCircle2 size={18} className="text-emerald-500" />}
              {toast.type === "error" && <AlertTriangle size={18} className="text-rose-500" />}
              {toast.type === "info" && <Info size={18} className="text-cyan-500" />}
              <span className="flex-1 text-sm font-medium text-slate-900 dark:text-white">{toast.message}</span>
              {toast.action && <a href={toast.action.href} className="text-xs font-bold text-cyan-600 hover:underline dark:text-cyan-400">{toast.action.label}</a>}
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
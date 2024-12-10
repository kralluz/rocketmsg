"use client";

import { ReactNode, useCallback, useState } from "react";
import { ToastContext } from "./ToastContext";
import { v4 as uuid } from "uuid";
import ToastContainer from "@/components/Toast/ToastContainer";

interface ToastMessage {
  id: string;
  type: "info" | "success" | "error" | "warning";
  message: string;
  isExiting?: boolean;
}

interface ToastProviderProps {
  children: ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) => {
    const id = uuid();
    setToasts((prev) => [...prev, { id, type, message }]);

    // Após 3.5s inicia o movimento de saída
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => t.id === id ? { ...t, isExiting: true } : t));
      // Após 300ms remove do DOM (tempo da animação)
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    // Ao remover manualmente, inicia o movimento de saída
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, isExiting: true } : t));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

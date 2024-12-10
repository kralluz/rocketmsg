import { createContext } from "react";

interface ToastMessage {
  id: string;
  type: "info" | "success" | "error" | "warning";
  message: string;
}

interface ToastContextProps {
  addToast: (type: ToastMessage["type"], message: string) => void;
  removeToast: (id: string) => void;
  toasts: ToastMessage[];
}

export const ToastContext = createContext<ToastContextProps>({
  addToast: () => {},
  removeToast: () => {},
  toasts: [],
});

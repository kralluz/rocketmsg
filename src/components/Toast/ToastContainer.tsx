"use client";

import { useContext } from "react";
import ToastItem from "./ToastItem";
import { ToastContext } from "@/context/ToastContext";

export default function ToastContainer() {
  const { toasts } = useContext(ToastContext);

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "2.5rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        maxWidth: "90vw",
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

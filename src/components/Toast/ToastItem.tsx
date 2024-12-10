"use client";

import { ToastContext } from "@/context/ToastContext";
import { useContext, useEffect, useState } from "react";
import {
  AiFillCheckCircle,
  AiFillInfoCircle,
  AiFillCloseCircle,
  AiFillWarning,
} from "react-icons/ai";

interface ToastItemProps {
  toast: {
    id: string;
    type: "info" | "success" | "error" | "warning";
    message: string;
    isExiting?: boolean;
  };
}

export default function ToastItem({ toast }: ToastItemProps) {
  const { removeToast } = useContext(ToastContext);
  const [isMounted, setIsMounted] = useState(false); // Controla a animação de entrada

  useEffect(() => {
    // Ativa a animação de entrada após montar
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  let icon;
  let bgColor;

  switch (toast.type) {
    case "success":
      icon = <AiFillCheckCircle size={20} />;
      bgColor = "rgba(56, 189, 248, 0.5)";
      break;
    case "error":
      icon = <AiFillCloseCircle size={20} />;
      bgColor = "rgba(244, 63, 94, 0.5)";
      break;
    case "warning":
      icon = <AiFillWarning size={20} />;
      bgColor = "rgba(234, 179, 8, 0.5)";
      break;
    case "info":
    default:
      icon = <AiFillInfoCircle size={20} />;
      bgColor = "rgba(96, 165, 250, 0.5)";
      break;
  }

  // Determina a posição do toast com base no estado
  // Se não montado ou saindo, fica fora da tela (translateX(150%))
  // Se montado, translateX(0)
  const translateX = !isMounted || toast.isExiting ? "150%" : "0%";

  return (
    <div
      onClick={() => removeToast(toast.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem 1rem",
        background: bgColor,
        backdropFilter: "blur(10px)",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        cursor: "pointer",
        color: "#fff",
        fontFamily: "sans-serif",
        fontSize: "0.875rem",
        maxWidth: "300px",
        width: "100%",
        transition: "transform 0.3s ease",
        transform: `translateX(${translateX})`, // Aplica a animação de entrada/saída
        wordWrap: "break-word",
      }}
    >
      {icon}
      <span style={{ flex: 1 }}>{toast.message}</span>
    </div>
  );
}

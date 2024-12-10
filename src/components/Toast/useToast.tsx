"use client";

import { ToastContext } from "@/context/ToastContext";
import { useContext } from "react";

export function useToast() {
  const { addToast } = useContext(ToastContext);

  return { addToast };
}

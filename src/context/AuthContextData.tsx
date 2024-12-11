"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast/useToast";

interface AuthContextData {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post("/api/auth", { username, password });
      const { token, refreshToken } = response.data;
      setToken(token);
      localStorage.setItem("refreshToken", refreshToken);
    } catch (error: any) {
      // Extrair mensagem de erro corretamente
      const errorMessage =
        error.response?.data?.error || error.message || "Erro desconhecido.";
      console.error("Erro ao fazer login:", errorMessage);
      throw new Error(errorMessage); // Repassa o erro para o componente que chama
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  const refreshAuthToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const response = await axios.patch("/api/auth", { refreshToken });
      setToken(response.data.token);
    } catch (error) {
      console.error("Erro ao renovar o token", error);
      logout();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshAuthToken();
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshAuthToken]);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ login, logout, token, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

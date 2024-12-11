// components/Login/Login.tsx
"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContextData";
import { useToast } from "@/components/Toast/useToast";
import "./Login.css";
import Input from "@/components/Input/Input";
import PasswordInput from "@/components/PasswordInput/PasswordInput";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      toast.addToast("success", "Login realizado com sucesso!");
      router.push("/");
    } catch (error: any) {
      const errorMessage = error.message || "Tente novamente.";
      toast.addToast("error", errorMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-heading">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <Input
            id="username"
            label="Usuário"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu usuário"
            required
          />
          <PasswordInput
            id="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
          <button type="submit" className="submit-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

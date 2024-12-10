"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@chakra-ui/react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: any) => {
    e.preventDefault();
    // Lógica de autenticação simples
    if (username === "adm" && password === "adm") {
      sessionStorage.setItem("isLoggedIn", "true");
      router.push("/");
    } else {
      alert("Credenciais inválidas!");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Usuário:</label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Senha:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" colorScheme="blue">
          Entrar
        </Button>
      </form>
    </div>
  );
}

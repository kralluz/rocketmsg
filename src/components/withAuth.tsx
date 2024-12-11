// withAuth.tsx
"use client";

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContextData";

interface WithAuthOptions {
  redirectTo?: string;
}

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) => {
  const { redirectTo = "/login" } = options;

  const ProtectedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, token } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      // Verifica se o usuário está autenticado
      if (!isAuthenticated || !token) {
        console.warn(
          "Usuário não autenticado. Redirecionando para:",
          redirectTo
        );
        router.push(redirectTo);
      }
    }, [isAuthenticated, token, redirectTo, router]);

    if (!isAuthenticated || !token) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return ProtectedComponent;
};

export default withAuth;

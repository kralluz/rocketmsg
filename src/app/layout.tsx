import "./globals.css";
import { ReactNode } from "react";
import ToastProvider from "@/context/ToastProvider";
import { Provider } from "@/components/provider";
import { AuthProvider } from "@/context/AuthContextData";

export const metadata = {
  title: "Rocket Msg",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <ToastProvider>
            <main>{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

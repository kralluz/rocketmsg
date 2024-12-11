import "./globals.css";
import { ReactNode } from "react";
import ToastProvider from "@/context/ToastProvider";
import { Provider } from "@/components/provider";

export const metadata = {
  title: "Rocket Msg",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Provider>
          <ToastProvider>
            <main style={{ padding: "1rem" }}>{children}</main>
          </ToastProvider>
        </Provider>
      </body>
    </html>
  );
}

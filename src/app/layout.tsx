import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laço's - Painel Administrativo",
  description: "Painel administrativo do aplicativo Laço's - Minha Saúde Feminina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}

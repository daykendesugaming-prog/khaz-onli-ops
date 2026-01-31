import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Robert Malave | Khazonli Ops",
  description: "Portafolio de Ingeniería de Operaciones, Automatización y Estrategia Fintech.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-[#0f172a] antialiased`}>
        {children}
      </body>
    </html>
  );
}
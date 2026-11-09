import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Keina Mark Studio | Design com origem. Peças com identidade.",
    template: "%s | Keina Mark Studio",
  },
  description:
    "Curadoria de peças que une criatividade, expressão e design contemporâneo com identidade brasileira e referências sutis à Amazônia.",
  keywords: [
    "Keina Mark Studio",
    "Design autoral",
    "Mobiliário contemporâneo",
    "Moda autoral",
    "Acessórios de design",
    "Design brasileiro",
    "Amazônia contemporânea",
  ],
  authors: [{ name: "Keina Mark Studio" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://keinamark.com.br",
    title: "Keina Mark Studio | Design com origem. Peças com identidade.",
    description:
      "Curadoria de peças que une criatividade, expressão e design contemporâneo.",
    siteName: "Keina Mark Studio",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${manrope.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#F5F1E9] text-[#242522] flex flex-col font-sans selection:bg-[#87563B] selection:text-[#F5F1E9]">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

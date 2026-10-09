import type { Metadata } from "next";
import Link from "next/link";
import { Library } from "lucide-react";
import { data, dateLabel } from "@/lib/data";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Dossiê Bolsonarista | Casos, contexto e fontes",
    template: "%s | Dossiê Bolsonarista",
  },
  description:
    "Arquivo documental sobre integrantes da família Bolsonaro. Casos, fontes e distinção de status jurídicos.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4"
        >
          Ir para o conteúdo
        </a>
        <header className="border-b border-neutral-800 bg-black text-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-6 py-6">
            <Link
              href="/"
              className="flex items-center gap-3 font-semibold tracking-wide"
            >
              <Library className="size-6 shrink-0 text-red-500" /> DOSSIÊ
              BOLSONARISTA
            </Link>
            <nav
              aria-label="Navegação principal"
              className="flex gap-6 text-sm text-neutral-200 [&_a:hover]:text-red-400"
            >
              <Link href="/">Home</Link>
              <Link href="/casos/">Casos</Link>
              <Link href="/timeline/">Linha do tempo</Link>
            </nav>
          </div>
        </header>
        <main id="conteudo" className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          {children}
        </main>
        <footer className="border-t border-neutral-800 bg-black">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-neutral-400">
            <p className="font-semibold text-white">
              Documentação, contexto e transparência.
            </p>
            <p className="mt-2">{data.editorial.publicationNotice}</p>
            <p className="mt-3 text-xs">
              Última atualização editorial: {dateLabel(data.updatedAt)} · Dados
              versionados em JSON
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Library } from "lucide-react";
import { data, dateLabel } from "@/lib/data";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Arquivo público | Documentação Bolsonaro",
    template: "%s | Arquivo público",
  },
  description:
    "Arquivo documental sobre integrantes da família Bolsonaro. Versão demonstrativa com placeholders explícitos e distinção de status jurídicos.",
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
        <div className="border-b border-amber-200 bg-amber-50 py-2 text-center text-xs text-amber-950">
          VERSÃO DEMONSTRATIVA · Sem casos factuais publicados
        </div>
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-6 py-6">
            <Link href="/" className="flex items-center gap-3 font-semibold">
              <Library className="size-6 text-teal-800" /> ARQUIVO PÚBLICO
            </Link>
            <nav
              aria-label="Navegação principal"
              className="flex gap-6 text-sm text-stone-600"
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
        <footer className="border-t border-stone-200">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-stone-500">
            <p className="font-semibold text-stone-700">
              Documentação, contexto e transparência.
            </p>
            <p className="mt-2">{data.editorial.demoNotice}</p>
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

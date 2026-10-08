import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CaseCard,
  EditorialNotice,
  Timeline,
  ResearchSources,
} from "@/components/archive";
import { data } from "@/lib/data";
export default function Home() {
  return (
    <>
      <section className="mb-12 max-w-3xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-teal-800">
          Memória documental · Acesso público
        </p>
        <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
          Os documentos.
          <br />O contexto.
          <br />
          <span className="text-teal-800">A trajetória dos casos.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-600">
          Um arquivo para consultar casos, investigações, decisões e
          controvérsias envolvendo integrantes da família Bolsonaro, com atenção
          às fontes e às etapas jurídicas.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/casos/">
              Explorar o arquivo <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/timeline/">Ver linha do tempo</Link>
          </Button>
        </div>
      </section>
      <EditorialNotice />
      <section className="my-12 grid grid-cols-2 gap-5 border-y border-stone-200 py-6 md:grid-cols-4">
        {[
          [
            String(data.cases.filter((c) => !c.placeholder).length),
            "Casos verificados",
          ],
          [
            String(data.cases.filter((c) => c.placeholder).length),
            "Registros demonstrativos",
          ],
          [String(data.people.length), "Perfis disponíveis"],
          [String(data.sources.length), "Portais primários"],
        ].map(([n, label]) => (
          <div key={label}>
            <p className="text-3xl font-semibold">{n}</p>
            <p className="mt-1 text-xs text-stone-500">{label}</p>
          </div>
        ))}
      </section>
      <section className="mb-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-500">
              O arquivo
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Registros demonstrativos
            </h2>
          </div>
          <Link
            href="/casos/"
            className="text-sm text-teal-800 underline underline-offset-4"
          >
            Ver todos
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {data.cases.map((c) => (
            <CaseCard key={c.id} item={c} />
          ))}
        </div>
      </section>
      <section className="mb-14 grid gap-10 md:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="text-xs uppercase tracking-wider text-teal-800">
            A sequência importa
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Linha do tempo</h2>
          <p className="mt-4 leading-relaxed text-stone-600">
            Cada etapa deve ser lida em seu contexto. Nesta versão, a cronologia
            mostra apenas marcos editoriais de demonstração.
          </p>
        </div>
        <Timeline />
      </section>
      <section className="mb-14">
        <h2 className="mb-5 text-2xl font-semibold">Pessoas</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {data.people.map((p) => (
            <Link
              key={p.id}
              href={`/pessoas/${p.slug}/`}
              className="rounded-lg border border-stone-200 bg-white p-5 hover:border-teal-700"
            >
              <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-stone-100 text-xs text-stone-600">
                {p.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <h3 className="font-medium">{p.name}</h3>
              <p className="mt-2 text-xs text-stone-500">
                Perfil · Sem casos associados
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold">A fonte vem primeiro</h2>
        <p className="mb-6 mt-3 text-sm text-stone-600">
          Portais institucionais para pesquisa. Estes links não são evidências
          dos registros demonstrativos.
        </p>
        <ResearchSources />
      </section>
    </>
  );
}

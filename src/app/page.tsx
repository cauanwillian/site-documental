import Link from "next/link";
import { VideoPlayer } from "@/components/video-player";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseCard, Timeline, ResearchSources } from "@/components/archive";
import { data, dateLabel } from "@/lib/data";
export default function Home() {
  return (
    <>
      <section className="mb-12 max-w-3xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-red-800">
          Memória documental · Acesso público
        </p>
        <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
          Os documentos.
          <br />O contexto.
          <br />
          <span className="text-red-800">A trajetória dos casos.</span>
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
      <section className="my-12 grid grid-cols-2 gap-5 border-y border-stone-200 py-6 md:grid-cols-4">
        {[
          [
            String(data.cases.filter((c) => !c.placeholder).length),
            "Registros publicados",
          ],
          [
            String(data.sources.filter((s) => s.scope === "case").length),
            "Referências dos casos",
          ],
          [String(data.people.length), "Perfis disponíveis"],
          [
            String(data.sources.filter((s) => s.scope === "research").length),
            "Portais primários",
          ],
        ].map(([n, label]) => (
          <div key={label}>
            <p className="text-3xl font-semibold">{n}</p>
            <p className="mt-1 text-xs text-stone-500">{label}</p>
          </div>
        ))}
      </section>
      {data.sections.map((section) => (
        <section key={section.id} className="mb-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-stone-500">
                O arquivo
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{section.name}</h2>
            </div>
            <Link
              href="/casos/"
              className="shrink-0 text-sm text-red-800 underline underline-offset-4"
            >
              Ver todos
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {data.cases
              .filter((c) => c.sectionId === section.id)
              .map((c) => (
                <CaseCard key={c.id} item={c} />
              ))}
          </div>
        </section>
      ))}
      <section className="mb-14" aria-label="Pautas em pesquisa">
        <h2 className="text-2xl font-semibold">Vídeos e pautas em pesquisa</h2>
        <p className="mt-3 mb-5 max-w-3xl text-sm leading-relaxed text-stone-600">
          Os registros com vídeo podem ser consultados abaixo. As demais pautas
          aguardam material original.
        </p>
        <ul className="grid gap-4 md:grid-cols-2">
          {data.researchAgenda.map((topic) => {
            const published =
              topic.publicationState === "published"
                ? data.cases.find((c) => c.id === topic.publishedCaseId)
                : undefined;
            return (
              <li
                key={topic.id}
                className={
                  published
                    ? "rounded-lg border border-stone-200 bg-white p-5"
                    : "rounded-lg border border-dashed border-stone-300 p-5"
                }
              >
                <h3 className="text-sm font-semibold">{topic.title}</h3>
                {published ? (
                  <>
                    <p className="my-3 text-xs text-red-800">
                      Registro publicado ·{" "}
                      {published.statusAsOf
                        ? dateLabel(published.statusAsOf)
                        : ""}
                    </p>
                    {published.videos?.map((video) => (
                      <VideoPlayer key={video.videoId} video={video} />
                    ))}
                    <blockquote className="mt-4 text-sm font-medium">
                      “{published.statements?.[0]?.quote}”
                    </blockquote>
                    <Link
                      href={`/casos/${published.slug}/`}
                      className="mt-4 inline-block text-sm text-red-800 underline underline-offset-4"
                    >
                      Consultar registro completo
                    </Link>
                  </>
                ) : (
                  <p className="mt-3 text-xs leading-relaxed text-stone-500">
                    {topic.requirements}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
      <section className="mb-14 grid gap-10 md:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="text-xs uppercase tracking-wider text-red-800">
            A sequência importa
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Linha do tempo</h2>
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
              className="rounded-lg border border-stone-200 bg-white p-5 hover:border-red-700"
            >
              <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-stone-100 text-xs text-stone-600">
                {p.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <h3 className="font-medium">{p.name}</h3>
              <p className="mt-2 text-xs text-stone-500">
                {data.cases.filter((c) => c.personIds.includes(p.id)).length}{" "}
                registro(s) relacionado(s)
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold">A fonte vem primeiro</h2>
        <p className="mb-6 mt-3 text-sm text-stone-600">
          Portais institucionais para pesquisa. As referências específicas de
          cada decisão estão nas páginas dos casos.
        </p>
        <ResearchSources />
      </section>
    </>
  );
}

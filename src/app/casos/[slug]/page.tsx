import Link from "next/link";
import { notFound } from "next/navigation";
import {
  data,
  statusOf,
  categoryOf,
  sectionOf,
  dateLabel,
  sourceTypeLabel,
} from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { EditorialNotice, Timeline } from "@/components/archive";
export function generateStaticParams() {
  return data.cases.map((c) => ({ slug: c.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title:
      data.cases.find((c) => c.slug === slug)?.title ??
      "Registro não encontrado",
  };
}
export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = data.cases.find((c) => c.slug === slug);
  if (!c) notFound();
  const status = statusOf(c.statusId);
  const sources = data.sources
    .filter((s) => (c.sourceIds as string[]).includes(s.id))
    .sort(
      (a, b) => Number(b.kind === "primary") - Number(a.kind === "primary"),
    );
  return (
    <>
      <Link href="/casos/" className="text-sm text-red-800">
        ← Todos os casos
      </Link>
      <div className="mt-8 flex gap-2">
        <Badge>{categoryOf(c.categoryId).name}</Badge>
        {c.placeholder && (
          <Badge className="bg-red-50 text-red-900">
            Placeholder · Não factual
          </Badge>
        )}
      </div>
      <h1 className="my-5 max-w-3xl text-4xl font-semibold">{c.title}</h1>
      <p className="mb-8 max-w-3xl text-lg text-stone-600">{c.summary}</p>
      <EditorialNotice />
      {c.legalCaveat && (
        <aside className="mt-5 rounded-lg border border-red-200 bg-red-50 p-5 text-sm leading-relaxed text-red-950">
          <strong className="block mb-2">Limites do registro</strong>
          {c.legalCaveat}
        </aside>
      )}
      <p className="mt-4 text-xs leading-relaxed text-stone-500">
        {c.editorialNote}
      </p>
      <div className="mt-10 grid gap-10 md:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="text-2xl font-semibold">Contexto do registro</h2>
          <p className="mt-4 leading-relaxed text-stone-600">{c.body}</p>

          {c.statements && c.statements.length > 0 && (
            <section className="mt-8" aria-label="Declarações documentadas">
              <h2 className="text-2xl font-semibold">Declarações e contexto</h2>
              <p className="mt-3 text-sm text-stone-600">
                As datas abaixo são as datas das falas. As citações são
                transcrições fornecidas pela edição.
              </p>
              <ol className="mt-5 space-y-5">
                {c.statements.map((statement) => (
                  <li
                    key={statement.id}
                    className="rounded-lg border border-stone-200 bg-white p-5"
                  >
                    <time
                      dateTime={statement.date}
                      className="text-xs uppercase tracking-wider text-red-800"
                    >
                      {dateLabel(statement.date)}
                    </time>
                    <blockquote className="my-4 border-l-2 border-red-700 pl-4 text-xl font-medium leading-relaxed">
                      “{statement.quote}”
                    </blockquote>
                    <p className="text-sm leading-relaxed text-stone-600">
                      <strong>Contexto: </strong>
                      {statement.context}
                    </p>
                    <ul className="mt-3 space-y-2 text-xs text-red-800">
                      {data.sources
                        .filter((source) =>
                          statement.sourceIds.includes(source.id),
                        )
                        .map((source) => (
                          <li key={source.id}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline underline-offset-4"
                            >
                              {source.title} ·{" "}
                              {source.kind === "primary"
                                ? "Fonte primária"
                                : "Fonte secundária"}
                            </a>
                          </li>
                        ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {c.otherEpisodes && c.otherEpisodes.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold">
                Outros episódios mencionados pela edição
              </h2>
              <ul className="mt-5 space-y-4">
                {c.otherEpisodes.map((episode) => (
                  <li
                    key={episode.id}
                    className="rounded-lg border border-stone-200 bg-white p-5"
                  >
                    <p className="text-sm leading-relaxed">
                      {episode.description}
                    </p>
                    <p className="mt-3 text-xs text-stone-500">
                      {episode.date
                        ? `Data informada: ${dateLabel(episode.date)} (somente o ano)`
                        : "Data não informada"}{" "}
                      · Referência específica não fornecida
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {c.relatedCaseIds.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold">Registros relacionados</h3>
              {data.cases
                .filter((other) => c.relatedCaseIds.includes(other.id))
                .map((other) => (
                  <Link
                    key={other.id}
                    href={`/casos/${other.slug}/`}
                    className="mt-2 block text-sm text-red-800 underline"
                  >
                    {other.title}
                  </Link>
                ))}
            </div>
          )}
          {c.defenseNote && (
            <section className="mt-8 rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="text-xl font-semibold">Posição da defesa</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {c.defenseNote}
              </p>
            </section>
          )}
          <h2 className="mb-6 mt-10 text-2xl font-semibold">Linha do tempo</h2>
          <Timeline caseId={c.id} />
          <h2 className="text-2xl font-semibold">Fontes do caso</h2>
          {sources.length ? (
            <ul aria-label="Fontes do caso" className="mt-4 space-y-3">
              {sources.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    rel="noopener noreferrer"
                    target="_blank"
                    className={
                      s.kind === "primary"
                        ? "block rounded-md border border-red-200 bg-red-50 p-4 text-red-900"
                        : "block rounded-md border border-stone-200 bg-white p-4 text-stone-600"
                    }
                  >
                    <strong>{s.title}</strong>
                    <span className="mt-2 block text-xs">
                      {s.institution} ·{" "}
                      {s.kind === "primary"
                        ? "Fonte primária"
                        : "Fonte secundária"}{" "}
                      · {sourceTypeLabel(s.documentType)}
                    </span>
                    <span className="mt-2 block text-xs">
                      Referência conferida pelo responsável editorial ·{" "}
                      {dateLabel(s.updatedAt)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600">
              Nenhuma referência específica foi fornecida para este registro. O
              texto foi fornecido pelo responsável editorial. Portais genéricos
              de pesquisa não são apresentados como comprovação deste caso.
            </p>
          )}
          {c.contextualSourceIds.length > 0 && (
            <section className="mt-6">
              <h3 className="text-lg font-semibold">Referências de contexto</h3>
              <p className="mt-2 text-sm text-stone-600">
                Material de panorama geral, sem atribuir a essa referência a
                comprovação de cada detalhe.
              </p>
              <ul className="mt-3 space-y-3">
                {data.sources
                  .filter((s) => c.contextualSourceIds.includes(s.id))
                  .map((s) => (
                    <li key={s.id}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-md border border-stone-200 bg-white p-4 text-sm text-stone-600"
                      >
                        {s.title} · Fonte secundária ·{" "}
                        {sourceTypeLabel(s.documentType)}
                      </a>
                    </li>
                  ))}
              </ul>
            </section>
          )}
          {c.sourceNote && (
            <p className="mt-4 text-xs leading-relaxed text-stone-500">
              {c.sourceNote}
            </p>
          )}
        </div>
        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-6">
          <p className="text-xs uppercase tracking-wider text-stone-500">
            {c.statusScope === "public-statement"
              ? "Natureza do registro"
              : "Status registrado"}
          </p>
          <h2 className="mt-3 text-xl font-semibold">{status.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {status.description}
          </p>
          <p className="mt-3 text-sm font-medium">
            {c.statusScope === "historical-decision"
              ? "Decisão registrada"
              : "Marco registrado"}
            :{" "}
            {c.statusAsOf
              ? dateLabel(c.statusAsOf)
              : c.statements?.length
                ? "várias datas; consulte as declarações"
                : "data não informada"}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-stone-500">
            {c.statusScope === "public-statement"
              ? "As datas se referem às falas, não às publicações que as reuniram. Controvérsia pública não equivale a condenação criminal."
              : "A situação processual atual e eventual trânsito em julgado não são afirmados neste registro."}
          </p>
          <hr className="my-6 border-stone-200" />
          <h3 className="text-sm font-semibold">Pessoas relacionadas</h3>
          {c.personIds.length ? (
            <ul className="mt-2 space-y-2">
              {data.people
                .filter((p) => (c.personIds as string[]).includes(p.id))
                .map((p) => (
                  <li key={p.id}>
                    <Link
                      className="text-sm text-red-800 underline"
                      href={`/pessoas/${p.slug}/`}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-stone-500">
              Nenhuma pessoa individualizada como envolvida neste registro.
            </p>
          )}
          {c.institutionalSubjects.length > 0 && (
            <section className="mt-5">
              <h3 className="text-sm font-semibold">Instituições e contexto</h3>
              <ul className="mt-2 space-y-2 text-sm text-stone-600">
                {c.institutionalSubjects.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </section>
          )}
          <hr className="my-6 border-stone-200" />
          <p className="text-xs text-stone-500">Seção</p>
          <p className="mt-2 text-sm">{sectionOf(c.sectionId).name}</p>
          <hr className="my-6 border-stone-200" />
          <p className="text-xs text-stone-500">Última atualização editorial</p>
          <p className="mt-2 text-sm">{dateLabel(c.updatedAt)}</p>
        </aside>
      </div>
    </>
  );
}

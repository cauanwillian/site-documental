import Link from "next/link";
import { notFound } from "next/navigation";
import { data, statusOf, categoryOf, sectionOf, dateLabel } from "@/lib/data";
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
      <Link href="/casos/" className="text-sm text-teal-800">
        ← Todos os casos
      </Link>
      <div className="mt-8 flex gap-2">
        <Badge>{categoryOf(c.categoryId).name}</Badge>
        {c.placeholder && (
          <Badge className="bg-amber-50 text-amber-900">
            Placeholder · Não factual
          </Badge>
        )}
      </div>
      <h1 className="my-5 max-w-3xl text-4xl font-semibold">{c.title}</h1>
      <p className="mb-8 max-w-3xl text-lg text-stone-600">{c.summary}</p>
      <EditorialNotice />
      {c.legalCaveat && (
        <aside className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">
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
          {c.relatedCaseIds.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold">Registros relacionados</h3>
              {data.cases
                .filter((other) => c.relatedCaseIds.includes(other.id))
                .map((other) => (
                  <Link
                    key={other.id}
                    href={`/casos/${other.slug}/`}
                    className="mt-2 block text-sm text-teal-800 underline"
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
                        ? "block rounded-md border border-teal-200 bg-teal-50 p-4 text-teal-900"
                        : "block rounded-md border border-stone-200 bg-white p-4 text-stone-600"
                    }
                  >
                    <strong>{s.title}</strong>
                    <span className="mt-2 block text-xs">
                      {s.institution} ·{" "}
                      {s.kind === "primary"
                        ? "Fonte primária"
                        : "Fonte secundária"}{" "}
                      ·{" "}
                      {s.documentType === "institutional-news"
                        ? "Notícia institucional"
                        : s.documentType === "video-report"
                          ? "Reportagem em vídeo"
                          : "Reportagem"}
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
                        {s.title} · Fonte secundária
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
            Status registrado
          </p>
          <h2 className="mt-3 text-xl font-semibold">{status.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {status.description}
          </p>
          <p className="mt-3 text-sm font-medium">
            {c.statusScope === "historical-decision"
              ? "Decisão registrada"
              : "Marco registrado"}
            : {c.statusAsOf ? dateLabel(c.statusAsOf) : "data não informada"}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-stone-500">
            A situação processual atual e eventual trânsito em julgado não são
            afirmados neste registro.
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
                      className="text-sm text-teal-800 underline"
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

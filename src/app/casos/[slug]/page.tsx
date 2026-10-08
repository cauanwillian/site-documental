import Link from "next/link";
import { notFound } from "next/navigation";
import { data, statusOf, categoryOf, dateLabel } from "@/lib/data";
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
      <div className="mt-10 grid gap-10 md:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="text-2xl font-semibold">Contexto do registro</h2>
          <p className="mt-4 leading-relaxed text-stone-600">{c.body}</p>
          <h2 className="mb-6 mt-10 text-2xl font-semibold">Linha do tempo</h2>
          <Timeline caseId={c.id} />
          <h2 className="text-2xl font-semibold">Fontes do caso</h2>
          {sources.length ? (
            <ul className="mt-4 space-y-3">
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
                      · Consulta: {dateLabel(s.accessedAt)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600">
              Nenhuma fonte factual cadastrada. Este placeholder não documenta
              um processo real. Os portais institucionais da Home servem apenas
              à pesquisa.
            </p>
          )}
        </div>
        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-6">
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Status jurídico
          </p>
          <h2 className="mt-3 text-xl font-semibold">{status.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {status.description}
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
              Nenhuma pessoa associada a este exemplo.
            </p>
          )}
          <hr className="my-6 border-stone-200" />
          <p className="text-xs text-stone-500">Última atualização editorial</p>
          <p className="mt-2 text-sm">{dateLabel(c.updatedAt)}</p>
        </aside>
      </div>
    </>
  );
}

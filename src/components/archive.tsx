import Link from "next/link";
import { ArrowUpRight, FileText, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { data, statusOf, categoryOf, dateLabel, type Case } from "@/lib/data";
export function CaseCard({ item }: { item: Case }) {
  return (
    <Link
      href={`/casos/${item.slug}`}
      className="group block rounded-lg border border-stone-200 bg-white p-6 transition hover:border-red-700 hover:shadow-sm"
    >
      <div className="flex flex-wrap gap-2">
        <Badge>{categoryOf(item.categoryId).name}</Badge>
        {item.placeholder && (
          <Badge className="bg-red-50 text-red-900 border-red-200">
            Placeholder
          </Badge>
        )}
      </div>
      <h3 className="my-4 text-xl font-semibold group-hover:text-red-800">
        {item.title} <ArrowUpRight className="inline size-4" />
      </h3>
      <p className="text-sm leading-relaxed text-stone-600">{item.summary}</p>
      <div className="mt-6 border-t border-stone-100 pt-4">
        <span className="text-xs uppercase tracking-wider text-stone-500">
          {item.statusScope === "public-statement"
            ? "Natureza do registro"
            : "Status registrado"}
        </span>
        <p className="mt-1 text-sm font-medium">
          {statusOf(item.statusId).name}
        </p>
        <p className="mt-1 text-xs text-stone-500">
          {item.statusAsOf
            ? dateLabel(item.statusAsOf)
            : item.statements?.length
              ? "Várias datas · Consulte as declarações"
              : "Data do marco não informada"}
        </p>
        <p className="mt-3 flex items-center gap-2 text-xs text-stone-500">
          <FileText className="size-3.5" />{" "}
          {item.sourceIds.length
            ? `${item.sourceIds.length} fonte(s)`
            : item.contextualSourceIds.length
              ? "Referência contextual"
              : "Referência específica não fornecida"}{" "}
          · {dateLabel(item.updatedAt)}
        </p>
      </div>
    </Link>
  );
}
export function Timeline({ caseId }: { caseId?: string }) {
  const events = data.timeline
    .filter((e) => !caseId || e.caseId === caseId)
    .sort((a, b) => b.date.localeCompare(a.date));
  if (!events.length)
    return (
      <p className="rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600">
        Não há marcos com data informada para este registro. A data de
        atualização editorial não é tratada como data dos fatos.
      </p>
    );
  return (
    <ol className="ml-2 border-l border-stone-300">
      {events.map((e) => (
        <li
          key={e.id}
          className="relative pb-8 pl-7 before:absolute before:-left-[5px] before:top-1 before:size-2.5 before:rounded-full before:bg-red-800"
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">
            {dateLabel(e.date)} ·{" "}
            {e.placeholder ? "Marco editorial" : statusOf(e.statusId).name}
          </p>
          {e.placeholder && (
            <Badge className="mb-2 bg-red-50 text-red-900">Placeholder</Badge>
          )}
          <h3 className="font-semibold">{e.title}</h3>
          <p className="mt-2 text-sm text-stone-600">{e.description}</p>
          {e.sourceIds.length > 0 && (
            <ul className="mt-3 text-xs text-red-800">
              {data.sources
                .filter((s) => (e.sourceIds as string[]).includes(s.id))
                .map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {s.title} ·{" "}
                      {s.kind === "primary"
                        ? "Fonte primária"
                        : "Fonte secundária"}
                    </a>
                  </li>
                ))}
            </ul>
          )}
          <Link
            className="mt-3 inline-block text-sm text-red-800 underline underline-offset-4"
            href={`/casos/${e.caseId}`}
          >
            Consultar registro
          </Link>
        </li>
      ))}
    </ol>
  );
}
export function ResearchSources() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {data.sources
        .filter((s) => s.scope === "research")
        .map((s) => (
          <a
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-stone-200 bg-white p-4 hover:border-red-700"
          >
            <ShieldCheck className="mb-3 size-5 text-red-800" />
            <span className="font-semibold">
              {s.name} <ArrowUpRight className="inline size-3" />
            </span>
            <p className="mt-2 text-xs text-stone-500">
              Portal primário para pesquisa
            </p>
          </a>
        ))}
    </div>
  );
}

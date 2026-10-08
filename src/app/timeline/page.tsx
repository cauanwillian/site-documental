import { Timeline, EditorialNotice } from "@/components/archive";
import { data } from "@/lib/data";
export const metadata = { title: "Linha do tempo" };
export default function TimelinePage() {
  return (
    <>
      <p className="text-xs uppercase tracking-wider text-teal-800">
        Cronologia documental
      </p>
      <h1 className="mt-3 text-4xl font-semibold">Linha do tempo</h1>
      <p className="mb-8 mt-4 text-stone-600">
        Decisões e acontecimentos do mais recente ao mais antigo. Quando o
        material informa apenas mês e ano, a cronologia preserva essa precisão.
      </p>
      <EditorialNotice />
      <div className="mt-10 grid gap-10 md:grid-cols-[1.5fr_1fr]">
        <Timeline />
        <aside>
          <h2 className="mb-5 text-xl font-semibold">Como ler os status</h2>
          <dl className="space-y-5">
            {data.legalStatuses.map((s) => (
              <div key={s.id} className="border-b border-stone-200 pb-4">
                <dt className="text-sm font-semibold">{s.name}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-stone-600">
                  {s.description}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </>
  );
}

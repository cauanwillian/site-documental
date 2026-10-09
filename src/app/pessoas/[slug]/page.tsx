import { notFound } from "next/navigation";
import { data } from "@/lib/data";
import { CaseCard } from "@/components/archive";
export function generateStaticParams() {
  return data.people.map((p) => ({ slug: p.slug }));
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
      data.people.find((p) => p.slug === slug)?.name ?? "Perfil não encontrado",
  };
}
export default async function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = data.people.find((p) => p.slug === slug);
  if (!person) notFound();
  const cases = data.cases.filter((c) =>
    (c.personIds as string[]).includes(person.id),
  );
  return (
    <>
      <p className="text-xs uppercase tracking-wider text-red-800">
        Perfil documental
      </p>
      <h1 className="mt-4 text-4xl font-semibold">{person.name}</h1>
      <p className="mb-8 mt-5 text-stone-600">{person.description}</p>
      <h2 className="mb-5 mt-10 text-2xl font-semibold">
        Registros relacionados
      </h2>
      {cases.length ? (
        <div className="grid gap-5 md:grid-cols-3">
          {cases.map((c) => (
            <CaseCard key={c.id} item={c} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-stone-200 bg-white p-8 text-stone-600">
          Nenhum caso publicado neste arquivo para este perfil.
        </p>
      )}
    </>
  );
}

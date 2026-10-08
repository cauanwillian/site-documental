import { EditorialNotice } from "@/components/archive";
import { CaseFilters } from "@/components/case-filters";
export const metadata = { title: "Casos" };
export default function Cases() {
  return (
    <>
      <p className="text-xs uppercase tracking-wider text-teal-800">
        Índice documental
      </p>
      <h1 className="mt-3 text-4xl font-semibold">Casos e registros</h1>
      <p className="mb-8 mt-4 text-stone-600">
        Consulte por pessoa, categoria e etapa jurídica. Todos os registros
        atuais são demonstrativos.
      </p>
      <EditorialNotice />
      <CaseFilters />
    </>
  );
}

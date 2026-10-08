"use client";
import { useState } from "react";
import { data } from "@/lib/data";
import { CaseCard } from "@/components/archive";
import { Button } from "@/components/ui/button";
export function CaseFilters() {
  const [person, setPerson] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const cases = data.cases.filter(
    (c) =>
      (!person || (c.personIds as string[]).includes(person)) &&
      (!category || c.categoryId === category) &&
      (!status || c.statusId === status),
  );
  return (
    <>
      <div className="my-8 grid gap-4 rounded-lg border border-stone-200 bg-white p-5 md:grid-cols-[1fr_1fr_1fr_auto]">
        {[
          {
            id: "person",
            name: "Pessoa",
            value: person,
            set: setPerson,
            options: data.people,
          },
          {
            id: "category",
            name: "Categoria",
            value: category,
            set: setCategory,
            options: data.categories,
          },
          {
            id: "status",
            name: "Status jurídico",
            value: status,
            set: setStatus,
            options: data.legalStatuses,
          },
        ].map((f) => (
          <div key={f.id} className="text-sm font-medium">
            <label htmlFor={f.id}>{f.name}</label>
            <select
              id={f.id}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="mt-2 block h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm"
            >
              <option value="">Todos</option>
              {f.options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
        ))}
        <Button
          variant="outline"
          className="self-end"
          onClick={() => {
            setPerson("");
            setCategory("");
            setStatus("");
          }}
        >
          Limpar filtros
        </Button>
      </div>
      <p aria-live="polite" className="mb-5 text-sm text-stone-500">
        {cases.length}{" "}
        {cases.length === 1 ? "registro encontrado" : "registros encontrados"}
      </p>
      {cases.length ? (
        <div className="grid gap-5 md:grid-cols-3">
          {cases.map((c) => (
            <CaseCard key={c.id} item={c} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-stone-300 p-10 text-center">
          <h2 className="font-semibold">
            Nenhum registro corresponde aos filtros
          </h2>
          <p className="mt-3 text-sm text-stone-600">
            Os placeholders não estão associados a pessoas reais. Limpe os
            filtros para consultar os exemplos.
          </p>
        </div>
      )}
    </>
  );
}

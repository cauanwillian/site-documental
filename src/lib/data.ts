import archive from "@/data/archive.json";
export const data = archive;
export type Case = (typeof data.cases)[number];
export const statusOf = (id: string) =>
  data.legalStatuses.find((s) => s.id === id)!;
export const categoryOf = (id: string) =>
  data.categories.find((c) => c.id === id)!;
export const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

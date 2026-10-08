import archive from "@/data/archive.json";
export const data = archive;
export type Case = (typeof data.cases)[number];
export const statusOf = (id: string) =>
  data.legalStatuses.find((s) => s.id === id)!;
export const categoryOf = (id: string) =>
  data.categories.find((c) => c.id === id)!;
export const dateLabel = (date: string) => {
  const monthOnly = /^\d{4}-\d{2}$/.test(date);
  return new Intl.DateTimeFormat(
    "pt-BR",
    monthOnly
      ? { month: "long", year: "numeric", timeZone: "UTC" }
      : { dateStyle: "long", timeZone: "UTC" },
  ).format(new Date(`${date}${monthOnly ? "-01" : ""}T00:00:00Z`));
};

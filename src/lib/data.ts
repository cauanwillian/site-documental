import archive from "@/data/archive.json";
export type Video = {
  provider: string;
  videoId: string;
  title: string;
  startSeconds: number;
  endSeconds: number;
  sourceId: string;
};
export type Case = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  personIds: string[];
  categoryId: string;
  statusId: string;
  statusAsOf: string | null;
  statusScope: string;
  sourceIds: string[];
  contextualSourceIds: string[];
  placeholder: boolean;
  updatedAt: string;
  verificationMethod: string;
  editorialNote: string;
  defenseNote: string | null;
  sectionId: string;
  institutionalSubjects: string[];
  legalCaveat: string;
  sourceNote: string;
  relatedCaseIds: string[];
  editorialNumber?: number;
  videos?: Video[];
  statements?: {
    id: string;
    date: string;
    quote: string;
    context: string;
    sourceIds: string[];
  }[];
  otherEpisodes?: {
    id: string;
    date: string | null;
    description: string;
    sourceIds: string[];
  }[];
};
export const data = { ...archive, cases: archive.cases as Case[] };
export const statusOf = (id: string) =>
  data.legalStatuses.find((s) => s.id === id)!;
export const categoryOf = (id: string) =>
  data.categories.find((c) => c.id === id)!;
export const sectionOf = (id: string) =>
  data.sections.find((s) => s.id === id)!;
export const dateLabel = (date: string) => {
  const yearOnly = /^\d{4}$/.test(date);
  const monthOnly = /^\d{4}-\d{2}$/.test(date);
  return new Intl.DateTimeFormat(
    "pt-BR",
    yearOnly
      ? { year: "numeric", timeZone: "UTC" }
      : monthOnly
        ? { month: "long", year: "numeric", timeZone: "UTC" }
        : { dateStyle: "long", timeZone: "UTC" },
  ).format(
    new Date(
      `${date}${yearOnly ? "-01-01" : monthOnly ? "-01" : ""}T00:00:00Z`,
    ),
  );
};

export const sourceTypeLabel = (type: string) =>
  ({
    "institutional-news": "Notícia institucional",
    "news-report": "Reportagem",
    "video-report": "Reportagem em vídeo",
    "video-reference": "Vídeo de referência",
    "academic-study": "Estudo acadêmico",
    "research-portal": "Portal de pesquisa",
  })[type] ?? "Documento";

import { test, expect } from "@playwright/test";

test("static archive navigation and combined filters", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Os documentos.",
  );
  await page.getByRole("link", { name: "Explorar o arquivo" }).click();
  await expect(page.getByText("3 registros encontrados")).toBeVisible();
  await page.getByLabel("Categoria", { exact: true }).selectOption("eleitoral");
  await page
    .getByLabel("Status jurídico", { exact: true })
    .selectOption("pendente");
  await expect(
    page.getByText("1 registro encontrado", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /Registro eleitoral demonstrativo/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "Fontes do caso" }),
  ).toBeVisible();
  await expect(
    page.getByText("Nenhuma fonte factual cadastrada.", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Todos os casos", exact: false })
    .click();
  await page
    .getByLabel("Pessoa", { exact: true })
    .selectOption("jair-bolsonaro");
  await expect(
    page.getByRole("heading", {
      name: "Nenhum registro corresponde aos filtros",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.getByText("3 registros encontrados")).toBeVisible();
  await page.goto("/pessoas/jair-bolsonaro/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Jair Bolsonaro",
  );
  await page.goto("/timeline/");
  await expect(
    page.getByRole("heading", { name: "Como ler os status" }),
  ).toBeVisible();
  await expect(
    page.getByText("Condenação definitiva", { exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("mobile pages fit viewport and primary portals are distinct", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/casos/",
    "/timeline/",
    "/casos/registro-judicial-demonstrativo/",
    "/pessoas/eduardo-bolsonaro/",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "STF Portal primário para pesquisa" }),
  ).toHaveAttribute("href", "https://portal.stf.jus.br/");
});

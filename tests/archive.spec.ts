import { test, expect } from "@playwright/test";

test("published cases, combined filters and primary sources", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Os documentos.",
  );
  await expect(
    page.getByText("Casos publicados", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("VERSÃO DEMONSTRATIVA", { exact: false }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Explorar o arquivo" }).click();
  await expect(page.getByText("4 registros encontrados")).toBeVisible();
  await page
    .getByLabel("Pessoa", { exact: true })
    .selectOption("jair-bolsonaro");
  await page.getByLabel("Categoria", { exact: true }).selectOption("eleitoral");
  await page
    .getByLabel("Status na decisão", { exact: true })
    .selectOption("inelegibilidade");
  await expect(page.getByText("2 registros encontrados")).toBeVisible();
  await page
    .getByRole("link", {
      name: /Desinformação eleitoral em reunião com embaixadores/,
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Inelegibilidade", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Decisão registrada: junho de 2023", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("list", { name: "Fontes do caso" }).getByRole("link", {
      name: /Por maioria de votos, TSE declara Bolsonaro/,
    }),
  ).toHaveAttribute("href", /tse.jus.br\/comunicacao\/noticias/);
  await page
    .getByRole("link", { name: "Todos os casos", exact: false })
    .click();
  await page
    .getByLabel("Pessoa", { exact: true })
    .selectOption("flavio-bolsonaro");
  await expect(
    page.getByRole("heading", {
      name: "Nenhum registro corresponde aos filtros",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.getByText("4 registros encontrados")).toBeVisible();
  await page.goto("/pessoas/jair-bolsonaro/");
  await expect(
    page.getByRole("main").getByRole("link", { name: /fonte\(s\)/ }),
  ).toHaveCount(3);
  await page.goto("/pessoas/eduardo-bolsonaro/");
  await expect(
    page.getByRole("link", { name: /Coação no curso do processo/ }),
  ).toBeVisible();
  await page.goto("/casos/tentativa-de-golpe-de-estado/");
  await expect(
    page.getByRole("heading", { name: "Posição da defesa" }),
  ).toBeVisible();
  await expect(
    page.getByText("Não foi fornecida referência específica", { exact: false }),
  ).toBeVisible();
  const sources = page
    .getByRole("list", { name: "Fontes do caso" })
    .getByRole("link");
  await expect(sources.first()).toHaveAttribute("href", /noticias.stf.jus.br/);
  await expect(sources.nth(1)).toHaveAttribute(
    "href",
    /agenciabrasil.ebc.com.br/,
  );
  await page.goto("/timeline/");
  await expect(
    page.getByRole("heading", { name: "Como ler os status" }),
  ).toBeVisible();
  await expect(
    page.getByText("Condenação definitiva", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("main ol > li").first()).toContainText(
    "junho de 2026",
  );
  expect(errors).toEqual([]);
});

test("mobile published pages fit viewport and research portals stay separate", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/casos/",
    "/timeline/",
    "/casos/tentativa-de-golpe-de-estado/",
    "/casos/reuniao-com-embaixadores/",
    "/casos/bicentenario-da-independencia/",
    "/casos/eduardo-bolsonaro-coacao-no-curso-do-processo/",
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
  await expect(
    page.getByRole("link", { name: /Portal primário para pesquisa/ }),
  ).toHaveCount(10);
});

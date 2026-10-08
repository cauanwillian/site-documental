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
  await expect(page.getByText("15 registros encontrados")).toBeVisible();
  await page
    .getByLabel("Pessoa", { exact: true })
    .selectOption("jair-bolsonaro");
  await page.getByLabel("Categoria", { exact: true }).selectOption("eleitoral");
  await page
    .getByLabel("Status jurídico", { exact: true })
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
  await page
    .getByLabel("Status jurídico", { exact: true })
    .selectOption("condenacao");
  await expect(
    page.getByRole("heading", {
      name: "Nenhum registro corresponde aos filtros",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.getByText("15 registros encontrados")).toBeVisible();
  await page.goto("/pessoas/jair-bolsonaro/");
  await expect(
    page.getByRole("main").getByRole("heading", { level: 3 }),
  ).toHaveCount(5);
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

test("financial section preserves requests, caveats, missing dates and institutional scope", async ({
  page,
}) => {
  await page.goto("/casos/");
  await page
    .getByLabel("Seção", { exact: true })
    .selectOption("financas-maquina-publica");
  await expect(page.getByText("11 registros encontrados")).toBeVisible();
  await page
    .getByLabel("Pessoa", { exact: true })
    .selectOption("michelle-bolsonaro");
  await expect(
    page.getByText("1 registro encontrado", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Cheques para Michelle/ }).click();
  await expect(page.getByText(/27 repasses por cheque/).first()).toBeVisible();
  await expect(
    page.getByRole("list", { name: "Fontes do caso" }).getByRole("link"),
  ).toHaveCount(2);
  await expect(
    page.getByText("Marco registrado: data não informada"),
  ).toBeVisible();
  await expect(
    page
      .getByRole("list", { name: "Fontes do caso" })
      .getByRole("link", { name: /BBC News Brasil/ }),
  ).toContainText("Reportagem em vídeo");
  await page.goto("/casos/joias-sauditas/");
  await expect(
    page.getByRole("heading", { name: "Pedido de arquivamento", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "O pedido da PGR não equivale a uma decisão judicial de arquivamento.",
      { exact: false },
    ),
  ).toBeVisible();
  await expect(page.getByText("Marco registrado: março de 2026")).toBeVisible();
  await expect(page.locator("main ol > li").last()).toContainText("2024");
  await page.goto("/casos/rachadinhas-na-alerj/");
  await expect(
    page.getByRole("heading", {
      name: "Anulações de provas e decisões processuais",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Referências de contexto" }),
  ).toBeVisible();
  await expect(
    page.getByText("não apresenta Flávio Bolsonaro como condenado", {
      exact: false,
    }),
  ).toBeVisible();
  await page.goto("/casos/orcamento-secreto/");
  await expect(
    page.getByText("Nenhuma referência específica foi fornecida", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Nenhuma pessoa individualizada como envolvida neste registro.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Instituições e contexto" }),
  ).toBeVisible();
  await expect(
    page.getByText("Congresso Nacional", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Não há marcos com data informada", { exact: false }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/casos/",
    "/casos/cheques-para-michelle/",
    "/casos/rachadinhas-na-alerj/",
    "/casos/orcamento-secreto/",
    "/pessoas/michelle-bolsonaro/",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
  }
});

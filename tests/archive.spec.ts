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
    page.getByText("Registros publicados", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("VERSÃO DEMONSTRATIVA", { exact: false }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Explorar o arquivo" }).click();
  await expect(page.getByText("27 registros encontrados")).toBeVisible();
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
  await expect(page.getByText("27 registros encontrados")).toBeVisible();
  await page.goto("/pessoas/jair-bolsonaro/");
  await expect(
    page.getByRole("main").getByRole("heading", { level: 3 }),
  ).toHaveCount(13);
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
    "outubro de 2026",
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
      name: "Denúncia rejeitada",
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

test("statements preserve quotes, speech dates and source scope", async ({
  page,
}) => {
  await page.goto("/casos/");
  await page
    .getByLabel("Seção", { exact: true })
    .selectOption("falas-controversas");
  await expect(page.getByText("7 registros encontrados")).toBeVisible();
  await page
    .getByRole("link", { name: /Pandemia, vacinas e mortes por covid-19/ })
    .click();
  const declarations = page.getByRole("region", {
    name: "Declarações documentadas",
  });
  await expect(declarations.locator("blockquote")).toHaveCount(7);
  await expect(declarations.locator("blockquote").first()).toHaveText(
    "“Gripezinha”",
  );
  await expect(declarations.locator("time").first()).toHaveAttribute(
    "datetime",
    "2020-03-24",
  );
  await expect(declarations.locator("time").last()).toHaveAttribute(
    "datetime",
    "2021-03-04",
  );
  await expect(
    page.getByRole("heading", { name: "Natureza do registro", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Controvérsia pública", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Tese no repositório da USP/ }),
  ).toContainText("Estudo acadêmico");
  await page.goto("/casos/falas-povos-indigenas-racismo/");
  await expect(page.locator("blockquote")).toHaveText(
    "“Cada vez mais o índio é um ser humano igual a nós.”",
  );
  await expect(
    page.getByRole("heading", {
      name: "Outros episódios mencionados pela edição",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Data não informada · Referência específica não fornecida", {
      exact: true,
    }),
  ).toHaveCount(3);
  await page.goto("/casos/homenagem-ustra-impeachment/");
  await expect(
    page.getByText("Marco registrado: 17 de abril de 2016"),
  ).toBeVisible();
  await expect(
    page.getByRole("list", { name: "Fontes do caso" }).getByRole("link"),
  ).toHaveAttribute("href", /camara.leg.br/);
  await expect(
    page.getByText(
      "As representações na Câmara não são apresentadas como denúncia criminal",
      { exact: false },
    ),
  ).toBeVisible();
  await expect(
    page.getByText("protegida pela imunidade parlamentar", { exact: false }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/casos/falas-pandemia-vacinas-mortes/",
    "/casos/falas-povos-indigenas-racismo/",
    "/casos/homenagem-ustra-impeachment/",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
  }
});

test("civil damages remain distinct from criminal conviction and public accusations", async ({
  page,
}) => {
  await page.goto("/casos/");
  await page
    .getByLabel("Seção", { exact: true })
    .selectOption("falas-controversas");
  await page
    .getByLabel("Categoria", { exact: true })
    .selectOption("mulheres-adolescentes");
  await expect(page.getByText("2 registros encontrados")).toBeVisible();
  await page
    .getByLabel("Status jurídico", { exact: true })
    .selectOption("condenacao-civil");
  await expect(
    page.getByText("1 registro encontrado", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Ofensas a Maria do Rosário/ }).click();
  await expect(
    page.getByRole("heading", {
      name: "Condenação civil por danos morais",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "A condenação informada é civil, por danos morais, e não criminal.",
      { exact: false },
    ),
  ).toBeVisible();
  await expect(
    page.getByText("Decisão registrada: data não informada"),
  ).toBeVisible();
  await expect(page.locator("main ol > li").first()).toContainText("2014");
  await expect(
    page.getByRole("list", { name: "Fontes do caso" }).getByRole("link"),
  ).toHaveAttribute("href", /stj.jus.br/);
  await page.goto("/casos/declaracao-adolescentes-venezuelanas/");
  await expect(page.locator("blockquote")).toHaveText("“pintou um clima”");
  await expect(page.locator("time")).toHaveAttribute("datetime", "2022-10");
  await expect(
    page.getByText("suas palavras foram distorcidas", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Controvérsia pública", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("list", { name: "Fontes do caso" })
      .getByRole("link", { name: /Vídeo de referência/ }),
  ).toHaveAttribute("href", "https://www.youtube.com/watch?v=QPlRVM6s12E");
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/casos/ofensas-maria-do-rosario/",
    "/casos/declaracao-adolescentes-venezuelanas/",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
  }
});

test("procedural outcome, institutional caveats and editorial period overview", async ({
  page,
}) => {
  await page.goto("/casos/rachadinhas-na-alerj/");
  await expect(
    page.getByRole("heading", { name: "Denúncia rejeitada", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Decisão registrada: maio de 2022"),
  ).toBeVisible();
  await expect(
    page.getByRole("list", { name: "Fontes do caso" }).getByRole("link"),
  ).toHaveAttribute("href", /agenciabrasil.ebc.com.br/);
  await page.goto("/casos/eduardo-lobby-documentos-eua/");
  await expect(
    page.getByText("Eduardo Bolsonaro negou ter recebido recursos.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "A menção em documentos não comprova recebimento de dinheiro.",
      { exact: false },
    ),
  ).toBeVisible();
  await page.goto("/casos/livro-flavio-bolsonaro-2017/");
  await expect(
    page.getByText(
      "A assessoria afirma que a obra defende valores democráticos e conservadores.",
    ),
  ).toBeVisible();
  await page.goto("/casos/tentativa-de-golpe-de-estado/");
  await expect(
    page.getByText(
      "Não significa que Jair Bolsonaro tenha praticado pessoalmente cada ato de vandalismo",
      { exact: false },
    ),
  ).toBeVisible();
  await page.goto("/timeline/");
  await expect(
    page
      .getByRole("region", { name: "Visão editorial por períodos" })
      .locator("dt"),
  ).toHaveCount(10);
  await page.goto("/");
  await expect(
    page
      .getByRole("region", { name: "Pautas em pesquisa" })
      .getByRole("listitem"),
  ).toHaveCount(5);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/timeline/",
    "/casos/crise-humanitaria-yanomami/",
    "/casos/gestao-pandemia-cpi-covid/",
    "/casos/ataques-instituicoes-8-janeiro/",
    "/casos/livro-flavio-bolsonaro-2017/",
    "/casos/eduardo-lobby-documentos-eua/",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
  }
});

test("video is promoted from research and embeds the selected excerpt on demand", async ({
  page,
}) => {
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<html><body>Player de teste</body></html>",
    }),
  );
  await page.goto("/");
  const agenda = page
    .getByRole("region", { name: "Pautas em pesquisa" })
    .getByRole("listitem")
    .filter({
      has: page.getByRole("heading", {
        name: "Ataque verbal a jornalista — 23 de agosto de 2020",
        exact: true,
      }),
    });
  await expect(
    agenda.getByRole("button", {
      name: /Carregar vídeo: Ataque verbal a jornalista/,
    }),
  ).toBeVisible();
  await expect(agenda.locator("iframe")).toHaveCount(0);
  await agenda.getByRole("button", { name: /Carregar vídeo:/ }).click();
  await expect(agenda.locator("iframe")).toHaveAttribute(
    "src",
    "https://www.youtube-nocookie.com/embed/ofxjBDSt4CQ?start=7&end=17&rel=0",
  );
  await expect(
    agenda.getByRole("link", { name: "Assistir no YouTube" }),
  ).toHaveAttribute("href", "https://www.youtube.com/watch?v=ofxjBDSt4CQ&t=7s");
  await expect(agenda.locator("blockquote")).toHaveText(
    "“Vontade de encher sua boca de porrada”",
  );
  await agenda
    .getByRole("link", { name: "Consultar registro completo" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "23 de agosto de 2020",
  );
  await expect(
    page
      .getByRole("region", { name: "Declarações documentadas" })
      .locator("time"),
  ).toHaveAttribute("datetime", "2020-08-23");
  await expect(
    page
      .getByRole("region", { name: "Vídeos do registro" })
      .getByRole("link", { name: "Assistir no YouTube" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("region", { name: "Vídeos do registro" })
    .getByRole("button", { name: /Carregar vídeo:/ })
    .click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});

test("second video keeps unknown speech date and separates contextual explanation", async ({
  page,
}) => {
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<html><body>Player de teste</body></html>",
    }),
  );
  await page.goto("/casos/declaracoes-preta-gil-homossexualidade-ditadura/");
  const videos = page.getByRole("region", { name: "Vídeos do registro" });
  await videos.getByRole("button", { name: /Carregar vídeo:/ }).click();
  await expect(videos.locator("iframe")).toHaveAttribute(
    "src",
    "https://www.youtube-nocookie.com/embed/l3m4nhtxLl4?start=57&end=231&rel=0",
  );
  await expect(
    videos.getByRole("link", { name: "Assistir no YouTube" }),
  ).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=l3m4nhtxLl4&t=57s",
  );
  const declarations = page.getByRole("region", {
    name: "Declarações documentadas",
  });
  await expect(declarations.locator("time")).toHaveCount(0);
  await expect(
    declarations.getByText("Data da fala não informada", { exact: true }),
  ).toHaveCount(2);
  await expect(declarations.locator("blockquote").nth(1)).not.toContainText(
    "[de ter um filho gay]",
  );
  await expect(
    page.getByText("Marco registrado: data não informada"),
  ).toBeVisible();
  await expect(
    page.getByText("Não há marcos com data informada", { exact: false }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.goto("/");
  const agenda = page.getByRole("region", { name: "Pautas em pesquisa" });
  await expect(
    agenda.getByRole("button", { name: /Carregar vídeo:/ }),
  ).toHaveCount(2);
});

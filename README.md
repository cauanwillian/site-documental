# Arquivo público

Site documental estático em Next.js, TypeScript, Tailwind CSS e componentes shadcn/ui. Sem banco, API ou backend separado.

## Desenvolvimento

Requer Node.js 22 ou superior.

```sh
npm ci
npm run dev
```

Abra http://localhost:3000. Para verificar: `npm run typecheck` e `npm run build`. O build gera `out/`, com todas as páginas pré-renderizadas. Para os testes de navegação e layout mobile: `npx playwright install chromium` (dispensável quando `/usr/bin/chromium` já existe), depois `npm run build && npm test`. Os testes usam Python 3 para servir os arquivos estáticos.

Para testar a exportação: `python3 -m http.server 3000 --directory out`.

## Vercel

Importe este repositório, selecione a branch `main` e o preset Next.js. Instalação: `npm ci`; build: `npm run build`. Não são necessárias variáveis de ambiente. O projeto usa `output: "export"`; mudanças nos arquivos JSON exigem um novo deploy. Não execute `next start` para a exportação estática.

## Dados e edição

Edite `src/data/archive.json`. Contém pessoas, casos, categorias, status jurídicos, eventos, fontes e datas editoriais. IDs referenciados devem existir. Slugs devem ser únicos e próprios para URLs. Datas usam `YYYY-MM-DD`.

Todos os casos e eventos iniciais são **placeholders não factuais**, sem associação a pessoas reais. Os perfis são estruturas para navegação; não afirmam participação em processos. Os links oficiais são portais de pesquisa, não provas de casos.

Para publicar um caso real, conclua a pesquisa, registre URLs dos documentos específicos nas fontes, preencha `personIds`, `sourceIds`, `statusId` e a cronologia, e altere `placeholder` para `false`. Fontes devem incluir título, instituição, URL do documento, natureza primária/secundária e data da consulta. Não publique alegações apenas com links genéricos para portais. Atualize os textos editoriais e contadores da Home quando houver conteúdo verificado. Prefira fontes primárias e contextualize recursos, anulações e limites das decisões. Os eventos devem informar suas próprias fontes.

`components.json` configura shadcn/ui; Button e Badge ficam em `src/components/ui`. Cores, tipografia e espaçamento são definidos com Tailwind CSS.

## Material recebido e pendente

`src/data/submissions.json` registra rascunhos enviados para conferência. Esse arquivo não é importado pela aplicação e não gera páginas públicas. O texto recebido não é tratado como fato verificado. Links repetidos são deduplicados; datas de tentativa de acesso são distintas de consultas bem-sucedidas. Status propostos são hipóteses editoriais, separados do status atual não verificado.

O primeiro rascunho reúne os links enviados sobre Jair Bolsonaro e a tentativa de golpe de Estado. O acesso às duas páginas foi bloqueado; o conteúdo ainda precisa ser lido a partir das páginas ou de cópias/PDFs. A alegação de revisão criminal necessita de fonte própria.

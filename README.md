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

Edite `src/data/archive.json`. Contém pessoas, casos, categorias, status jurídicos, eventos, fontes e datas editoriais. IDs referenciados devem existir. Slugs devem ser únicos e próprios para URLs. Datas usam `YYYY-MM-DD` ou `YYYY-MM` quando apenas mês e ano foram fornecidos. `statusId` representa o status da decisão na data `statusAsOf`, sem inferir o estado processual atual.

O arquivo contém 20 registros publicados com textos e referências conferidos pelo responsável editorial. `verificationMethod: "publisher-confirmed"` registra essa origem; não indica consulta independente pela ferramenta. As notícias institucionais são distinguidas de acórdãos e reportagens. Os portais genéricos (`scope: "research"`) ficam separados das referências específicas (`scope: "case"`). Os exemplos demonstrativos foram removidos.

Para publicar um caso real, conclua a pesquisa, registre URLs dos documentos específicos nas fontes, preencha `personIds`, `sourceIds`, `statusId` e a cronologia, e altere `placeholder` para `false`. Fontes devem incluir título, instituição, URL do documento, natureza primária/secundária e data da consulta. Não publique alegações apenas com links genéricos para portais. Atualize os textos editoriais e contadores da Home quando houver conteúdo verificado. Prefira fontes primárias e contextualize recursos, anulações e limites das decisões. Os eventos devem informar suas próprias fontes.

`components.json` configura shadcn/ui; Button e Badge ficam em `src/components/ui`. Cores, tipografia e espaçamento são definidos com Tailwind CSS.

## Material recebido e histórico editorial

`src/data/submissions.json` preserva o histórico do primeiro material recebido, as tentativas de acesso e sua promoção ao arquivo público. Esse arquivo não é importado pela aplicação. O rascunho foi publicado após confirmação explícita do responsável editorial de que os materiais estavam conferidos. As questões originais permanecem como histórico, sem sugerir que houve consulta independente.

Novos materiais podem ser publicados após confirmação editorial com textos, referências e datas informados, sem criar detalhes ou datas ausentes. `accessedAt: null` evita registrar uma consulta que não ocorreu. O status publicado é histórico; recursos e trânsito em julgado exigem informações próprias. A menção aos pedidos de revisão criminal é atribuída à informação editorial e assinala a ausência de uma referência específica.

## Seções financeiras e institucionais

`sectionId` agrupa os registros; o filtro de seção combina com pessoa, categoria e status. `institutionalSubjects` identifica Governo, Congresso ou Presidência sem associar automaticamente o registro a uma pessoa. Michelle Bolsonaro, Fabrício Queiroz e Márcia Aguiar têm perfis vinculados aos registros em que foram mencionados.

`sourceIds` são referências específicas; `contextualSourceIds` são panoramas gerais, exibidos em uma seção separada. Registros sem links específicos permanecem publicados como texto editorial com essa ausência indicada. Nenhum link genérico é usado como evidência. As cinco novas referências são secundárias, inclusive a Agência Brasil ao noticiar a PGR e o vídeo atribuído à BBC pelo responsável editorial.

`statusAsOf: null` significa data não informada, sem substituição pela data de atualização. A cronologia aceita ano (`YYYY`), mês e ano ou data completa, e não cria eventos para registros sem datas. O status `pedido-arquivamento` não significa arquivamento decidido. `anulacao-provas` não significa anulação de todo o processo. `legalCaveat` preserva os limites e as ressalvas de cada registro.

## Falas controversas

A seção `falas-controversas` contém cinco páginas temáticas. `statements` preserva cada citação enviada, sua data, seu contexto separado e suas referências. `otherEpisodes` reúne resumos sem transcrições ou fontes específicas, com datas nulas quando ausentes. As datas da cronologia são as das falas, sem usar datas das reportagens ou o identificador de publicação da tese. A tese da USP é uma fonte acadêmica secundária de contexto, sem páginas específicas informadas. A notícia da Câmara é fonte institucional para as representações; não é apresentada como decisão criminal ou como prova independente do reconhecimento judicial de Ustra. Os episódios são controvérsias públicas, sem inferir condenação.

## Mulheres e adolescentes

Os dois registros da categoria `mulheres-adolescentes` estão na seção de falas controversas. `condenacao-civil` distingue a indenização por danos morais de uma condenação criminal. O ano das ofensas a Maria do Rosário (`2014`) fica na cronologia; a data de julgamento não foi fornecida e permanece nula, sem usar a data do endereço da notícia como substituto. A fala sobre adolescentes venezuelanas preserva apenas a expressão enviada e a precisão mensal (`2022-10`), junto da resposta de Bolsonaro. O vídeo sem título/canal/minutagem é rotulado como referência de vídeo secundária, sem afirmar origem ou integralidade.

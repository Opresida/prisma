# ARCHITECTURE — Como o Prisma é feito

## Visão geral

Site **estático, sem build**: `index.html` + `styles.css` + `app.js`. Nenhuma dependência de runtime, nenhum servidor de aplicação. Deploy = servir arquivos. Isso é uma decisão de produto (rápido + privado + simples), não só técnica.

```
Navegador
 ├── index.html   → casca (head/SEO/OG, boot spinner, top bar, #stage)
 ├── styles.css   → design system + spinner + papel timbrado (print) + telemedicina
 └── app.js       → dados, estado, telas, scoring, papel timbrado, ajustes
```

## Estado e navegação

Um objeto de estado único e uma máquina de telas:

```js
st = { screen, profile, i, raw }
// screen ∈ welcome → profile → intro → quiz → result
```

`render()` injeta o HTML da tela atual em `#stage`. Cliques são tratados por **um** listener delegado (`data-a="..."`). Sem router, sem virtual DOM.

## Modelo de instrumento

Cada instrumento (`ADULT`, `CHILD`) é um objeto declarativo:

```js
{
  scale: "agree" | "yesno",     // tipo de resposta
  options: [...],               // rótulos das respostas
  domains: { chave: "Rótulo" }, // áreas para o mapa
  q: [ { t, d, s|risk } ],      // perguntas + domínio + direção de pontuação
  bands: [ { max, key, label, color, blurb } ],
  steps: [ ... ]                // próximos passos
}
```

Adicionar um instrumento = adicionar um objeto e roteá-lo em `INSTR`. Nada de tocar na engine.

## Pontuação

`scored(item, v)` decide se uma resposta "pontua":
- **AQ-10 (`agree`)** — concordar pontua em itens `s:"agree"`, discordar pontua em itens `s:"disagree"`.
- **M-CHAT-R/F (`yesno`)** — pontua quando a resposta = `risk` do item (itens 2, 5, 12 → "Sim"; demais → "Não").

`compute()` retorna `{ total, n, band, dom }`, onde `dom[area] = {c, n}` alimenta o **mapa por área**. A faixa (`band`) é a primeira cujo `max` cobre o total.

## Papel timbrado (PDF)

`buildLetterhead()` monta um documento A4 (`#letterhead`) com cores **fixas claras** (independe do tema). "Baixar resultado (PDF)" mostra o spinner brevemente, abre o documento num modal e o botão "Salvar como PDF" chama `window.print()`.

O `@media print` em `styles.css` oculta tudo, exibe só `#letterhead`, aplica `print-color-adjust: exact` (para as cores saírem) e define `@page A4`. Rodapé: crédito IDASAM + MAZARI CORP. + data de geração + "sem validade diagnóstica".

> _Evolução possível:_ trocar impressão por geração one-click com jsPDF/html2canvas (ver TODO). A impressão foi escolhida por ser zero-dependência, offline e cross-device.

## Spinner / boot

`#boot` cobre a tela no carregamento e some no `load` (respeitando `prefers-reduced-motion`). É reaproveitado como "Preparando seu documento…" ao gerar o PDF. O anel usa `conic-gradient` do espectro com máscara radial.

## Ajustes sensoriais e temas

- `⚙︎ Ajustes` adiciona classes em `<html>`: `.pref-rm` (reduzir movimento) e `.pref-lg` (texto maior), persistidas em `localStorage`.
- Temas: tokens em `:root`, redefinidos em `@media (prefers-color-scheme: dark)` e sobrescritos por `:root[data-theme="light|dark"]`.

## Armazenamento

Apenas `localStorage` para preferências sensoriais. **Respostas não são persistidas nem enviadas** (ver `CANON.md` §5). Histórico local longitudinal é backlog (TODO), e também ficará no aparelho.

## Deploy, headers e OG

- `netlify.toml`: `publish = "."`, sem build, **CSP** (`script-src 'self'`, `style-src 'self' 'unsafe-inline'` por causa dos estilos inline), cache longo em `/assets/*`.
- **Pipeline do OG:** `og.html` é a fonte; renderiza-se em 1200×630 e captura-se `assets/og-image.png`. Ao mudar a copy do card, regenerar a imagem.

## Não-objetivos (por enquanto)

Sem backend, sem contas, sem analytics que identifique, sem framework. Cada um desses só entra com justificativa forte e sem violar o `CANON.md`.

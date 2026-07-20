# CLAUDE.md — Prisma

Instruções para qualquer agente (Claude Code) trabalhando neste repositório.
**Leia [`docs/CANON.md`](docs/CANON.md) antes de tocar em qualquer conteúdo, texto ou lógica de resultado.**

## O que é

Prisma = rastreio (_screening_) acolhedor de sinais de autismo, **multi-perfil**, com UX autista-friendly. **Orientação, não diagnóstico.** Uma plataforma **IDASAM** em parceria com a **MAZARI CORP.**

- Live: `https://prismatea.netlify.app` · Repo: `github.com/Opresida/prisma`

## Diretriz suprema (nunca quebrar)

> O app **nunca diagnostica**. Ele estima uma **faixa de sinais** e **sempre** encaminha para avaliação profissional. Nenhum texto pode afirmar ou sugerir que a pessoa "tem autismo".

Se um pedido colidir com isso, pare e sinalize — não implemente.

## Perfis e instrumentos (4)

Na entrada, o usuário escolhe o perfil; cada um roteia para o instrumento certo:

| Perfil (`st.profile`) | Instrumento | Escala | Corte |
|---|---|---|---|
| `adult` | **AQ-10** (10 itens) | `agree` (4 pontos) | ≥6 = vários sinais |
| `adult` → `catq` | **CAT-Q** (25 itens) — aprofundamento de camuflagem, opcional após o AQ-10 | `likert7` | ≥100 de 175 = camufla |
| `child` | **M-CHAT-R/F** (20 itens) — bebê 16–30 meses | `yesno` | 0–2 / 3–7 / 8–20 |
| `child2` | **CAST** (30 itens) — criança 4–11 anos | `yesno` | ≥15 = encaminhar |

AQ-10 é fiel. M-CHAT / CAST / CAT-Q têm itens em **redação adaptada** (ver Fidelidade). O **SCQ** (proprietário/WPS, licença paga) foi preterido em favor do **CAST** (gratuito, Cambridge/ARC).

## Stack e filosofia técnica

- **Site estático, zero build.** HTML + CSS + JavaScript vanilla. Sem framework, sem bundler, sem dependências de runtime.
- **Não introduza build/framework** sem necessidade real e aprovação do Humberto. A simplicidade é proposital: carregamento rápido = experiência calma = acessível.
- **Local-first.** Nenhuma chamada de rede que envie respostas sem consentimento explícito + base legal (LGPD).
- Um único estado (`st`) e uma máquina de telas em `app.js`. Renderização por `innerHTML`, um listener delegado (`data-a="..."`).

## Rodar / prever

```bash
python -m http.server 8899 --directory .   # → http://127.0.0.1:8899
```
Sem testes automatizados ainda (ver `docs/TODO.md`). Valide manualmente:
- Os **3 perfis** (adulto, bebê 16–30m, criança 4–11) até o resultado.
- O **aprofundamento de camuflagem**: adulto → resultado → card "Aprofundar: você se camufla?" → CAT-Q → resultado combinado.
- "Baixar resultado (PDF)" nos dois tipos (padrão e combinado AQ-10 + CAT-Q).
- Ajustes sensoriais (reduzir movimento / texto maior), temas claro/escuro e o spinner de boot (~4s).

## Mapa de arquivos

| Arquivo | Papel |
|---|---|
| `index.html` | `<head>` (SEO/OG/favicon/manifest), boot spinner, top bar, `#stage` |
| `styles.css` | tokens (tema claro/escuro), componentes, spinner, **papel timbrado + `@media print`**, cards telemedicina/aprofundar |
| `app.js` | instrumentos `ADULT`/`CHILD`/`CAST`/`CATQ`, `compute()` + `catqScore()`, telas (inclui `screenResultCatq()`), `buildLetterhead()`/`buildLetterheadCatq()`, ajustes |
| `og.html` → `assets/og-image.png` | fonte do card social; regenerar (screenshot 1200×630) quando a copy mudar |

## Fluxo de estado (resumo)

`st = { screen, profile, i, raw, aq }` · telas: `welcome → profile → intro → quiz → result`.

- Ao terminar o AQ-10 (adulto), o resultado é fotografado em `st.aq` (`{total, n, band, raw}`).
- O card **"Aprofundar"** (só no resultado do adulto) leva ao CAT-Q (`profile:"catq"`); `catqBack` restaura o AQ-10 a partir de `st.aq.raw`.
- **CAST (`child2`)** e **M-CHAT (`child`)** reusam a tela de resultado e o papel timbrado padrão; **CAT-Q** tem `screenResultCatq()` + `buildLetterheadCatq()` (PDF combinado AQ-10 + CAT-Q, com o cruzamento "poucos sinais + camuflagem alta = diagnóstico tardio").

## Regras de conteúdo e tom

- Linguagem **literal, acolhedora, sem alarme**. Sem idiomas/ironia. Nunca infantilizar nem dramatizar.
- Resultados são **faixas** ("poucos / alguns / vários sinais"), nunca notas nem rótulos.
- Cores das faixas são **dessaturadas de propósito** (sálvia/âmbar/argila). **Nunca** vermelho de alarme.
- Ao mudar a headline, atualizar em **3 lugares**: `app.js` (hero), `og.html` (+ regenerar `og-image.png`) e `index.html` (`og:title`/`twitter:title`).

## Fidelidade dos instrumentos

- **Cortes e pontuação são oficiais — não invente:** AQ-10 ≥6; M-CHAT 0–2 / 3–7 / 8–20 (risco: itens 2, 5 e 12 no "Sim", demais no "Não"); CAT-Q limiar 100, reversos 3/12/19/22/24; CAST ≥15.
- Os **itens** de M-CHAT, CAST e CAT-Q estão em **redação adaptada para protótipo**. Antes de qualquer claim de produção, trocar pela **redação oficial validada PT-BR** (M-CHAT pela SBP; CAT-Q e CAST por tradução validada). Ver `CANON.md` §4.

## Acessibilidade (invariantes)

Uma pergunta por tela · Voltar sempre · sem timer · foco de teclado visível · respeitar `prefers-reduced-motion` e `prefers-color-scheme` · manter os Ajustes (Reduzir movimento / Texto maior). Spinner de boot ~4s (com fallback).

## Branding

Prisma tem **identidade própria** (petróleo sereno + espectro). IDASAM e MAZARI CORP. aparecem **apenas como crédito de parceria** (rodapé do app e do papel timbrado) — **não** importar a identidade visual deles para dentro do Prisma.

## Telemedicina

Mantém-se **"em breve"** até existir profissional real, fluxo de consentimento e conformidade (CFM). Não ligar nenhum fluxo funcional de atendimento sem isso.

## Deploy

Netlify, site estático (`netlify.toml`: `publish = "."`, sem build, CSP, cache). Push na `main` → deploy automático. Domínio: `prismatea.netlify.app` (se migrar para domínio próprio, atualizar `og:url`/`og:image`/`canonical` em `index.html`).

## Convenções gerais

- Prefixar comandos com `rtk` (ver CLAUDE.md global do Humberto). **Obs.:** nesta versão do `rtk`, `git commit` não passa (erro `command git:commit not found`) — usar `git` puro no commit.
- Explicar mudanças técnicas por analogia do dia a dia.
- Não fazer meia-obra: se cotou, executa ponta a ponta.

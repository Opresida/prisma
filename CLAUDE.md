# CLAUDE.md — Prisma

Instruções para qualquer agente (Claude Code) trabalhando neste repositório.
**Leia [`docs/CANON.md`](docs/CANON.md) antes de tocar em qualquer conteúdo, texto ou lógica de resultado.**

## O que é

Prisma = rastreio (_screening_) acolhedor de sinais de autismo. **Orientação, não diagnóstico.**
Uma plataforma **IDASAM** em parceria com a **MAZARI CORP.**

## Diretriz suprema (nunca quebrar)

> O app **nunca diagnostica**. Ele estima uma **faixa de sinais** e **sempre** encaminha para avaliação profissional. Nenhum texto pode afirmar ou sugerir que a pessoa "tem autismo".

Se um pedido colidir com isso, pare e sinalize — não implemente.

## Stack e filosofia técnica

- **Site estático, zero build.** HTML + CSS + JavaScript vanilla. Sem framework, sem bundler, sem dependências de runtime.
- **Não introduza build/framework** sem necessidade real e aprovação do Humberto. A simplicidade é proposital: carregamento rápido = experiência calma = acessível.
- **Local-first.** Nenhuma chamada de rede que envie respostas sem consentimento explícito + base legal (LGPD).
- Um único estado (`st`) e uma máquina de telas em `app.js`. Renderização por `innerHTML`.

## Rodar / prever

```bash
python -m http.server 8899   # → http://127.0.0.1:8899
```
Não há testes automatizados ainda (ver `docs/TODO.md`). Valide manualmente: os dois perfis, o mapa de resultado, o botão "Baixar resultado (PDF)" (impressão), os Ajustes sensoriais e os temas claro/escuro.

## Mapa de arquivos

| Arquivo | Papel |
|---|---|
| `index.html` | `<head>` (SEO/OG/favicon/manifest), boot spinner, top bar, `#stage` |
| `styles.css` | Tokens (tema claro/escuro), componentes, spinner, **papel timbrado + `@media print`**, card telemedicina |
| `app.js` | `ADULT`/`CHILD` (instrumentos), `compute()` (scoring), telas, `buildLetterhead()`, ajustes sensoriais |
| `og.html` → `assets/og-image.png` | Fonte do card social; regenerar via screenshot 1200×630 quando a copy mudar |

## Regras de conteúdo e tom

- Linguagem **literal, acolhedora, sem alarme**. Sem idiomas/ironia. Nunca infantilizar nem dramatizar.
- Resultados são **faixas** ("poucos / alguns / vários sinais"), nunca notas nem rótulos.
- Cores das faixas são **dessaturadas de propósito** (sálvia/âmbar/argila). **Nunca** vermelho de alarme.
- Ao mudar a headline, atualizar em **3 lugares**: `app.js` (hero), `og.html` + regenerar `og-image.png`, e `index.html` (`og:title`/`twitter:title`).

## Fidelidade dos instrumentos

- AQ-10 e M-CHAT-R/F têm pontuação **oficial** — não invente cortes.
- Os itens da criança estão **adaptados para protótipo**. Antes de qualquer claim de produção, trocar pela **redação oficial validada PT-BR** do M-CHAT-R/F (SBP) — mantendo a lógica de risco (itens 2, 5 e 12 pontuam no "Sim"; os demais no "Não").

## Acessibilidade (invariantes)

Uma pergunta por tela · Voltar sempre · sem timer · foco de teclado visível · respeitar `prefers-reduced-motion` e `prefers-color-scheme` · manter os Ajustes (Reduzir movimento / Texto maior).

## Branding

Prisma tem **identidade própria** (petróleo sereno + espectro). IDASAM e MAZARI CORP. aparecem **apenas como crédito de parceria** (rodapé do app e do papel timbrado) — **não** importar a identidade visual deles para dentro do Prisma.

## Telemedicina

Mantém-se **"em breve"** até existir profissional real, fluxo de consentimento e conformidade. Não ligar nenhum fluxo funcional de atendimento sem isso.

## Convenções gerais

- Prefixar comandos com `rtk` (ver CLAUDE.md global do Humberto).
- Explicar mudanças técnicas por analogia do dia a dia.
- Não fazer meia-obra: se cotou, executa ponta a ponta.

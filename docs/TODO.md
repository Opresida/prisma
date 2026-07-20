# TODO — Roadmap / backlog do Prisma

Atualizar após cada funcionalidade aprovada. Datas em formato absoluto.

## 🔴 Antes de chamar de "produção" (bloqueadores)

- [ ] **Itens oficiais do M-CHAT-R/F** — substituir os itens *adaptados* da criança pela redação validada em PT-BR (SBP), mantendo a lógica de risco. (`CANON.md` §4)
- [ ] **Revisão profissional** do conteúdo clínico e dos textos de encaminhamento. (`CANON.md` §8)
- [ ] **Domínio real** — atualizar `og:url`/`og:image`/`canonical` em `index.html` (hoje: placeholder `prisma-idasam.netlify.app`).
- [ ] **Página/《aviso》 de privacidade** explícita (o que é coletado = nada é enviado) e termos de uso.

## 🟡 Próximas features

- [ ] **Telemedicina** (hoje "em breve") — parceria com profissionais, fila/agenda, **consentimento**, conformidade CFM. Só ligar quando for real. (`CANON.md` §10)
- [ ] **Aprofundamento do adulto** — RAADS-R (80 itens) e CAT-Q (camuflagem/_masking_), oferecidos após o AQ-10.
- [ ] **Faixa 4–11 anos** — adicionar SCQ (ou CAST) como terceiro perfil.
- [ ] **Histórico local (longitudinal)** — salvar resultados no aparelho e permitir comparar evolução ao refazer. Mantém local-first.
- [ ] **Papel timbrado one-click** — avaliar jsPDF/html2canvas para baixar o PDF sem passar pelo diálogo de impressão (opcional; hoje via impressão é offline e robusto).

## 🟢 Melhorias

- [ ] **PWA offline** — service worker para funcionar sem rede (o app já é local-first; falta cache de assets).
- [ ] **Testes** — smoke test de scoring por instrumento (faixas nos limites) e um _lint_ básico.
- [ ] **Copy** — passar as headlines pelo squad de copy quando fizer sentido.
- [ ] **i18n** — estrutura para outras línguas (base já é declarativa).
- [ ] **Analytics privacy-first** — só se consentido e sem identificar (ex.: contagem agregada de conclusões).

## Ideias / a decidir

- [ ] Modo "para profissionais" (aplicar e imprimir vários relatórios).
- [ ] Integração com a rede IDASAM para encaminhamento direto.
- [ ] Vídeo/onboarding curto explicando "isto é orientação, não diagnóstico".

## Histórico

- **2026-07-20** — Repositório criado. App refatorado (index/styles/app), papel timbrado (print) com rodapé IDASAM+MAZARI, spinner de boot, card telemedicina "em breve", favicon, manifest, OG 1200×630, `netlify.toml` + CSP, documentação canônica. Headline: "Entenda possíveis sinais de autismo, sem pressa nem julgamento."

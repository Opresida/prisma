# PROJECT_CONTEXT — Snapshot para retomar

_Foto do estado do projeto. Atualizar ao fim de cada sessão relevante._

## Resumo

**Prisma** — rastreio acolhedor de sinais de autismo (orientação, não diagnóstico). Multi-perfil (adulto/criança) com UX autista-friendly. Uma plataforma **IDASAM** em parceria com a **MAZARI CORP.**

- **Local:** `C:\Users\user\prisma`
- **Repositório:** https://github.com/Opresida/prisma.git
- **Deploy:** Netlify (site estático, sem build) — `https://prismatea.netlify.app`
- **Stack:** HTML + CSS + JS vanilla, zero build, local-first
- **Time:** Humberto + Claude

## Como rodar

```bash
cd /c/Users/user/prisma
python -m http.server 8899   # → http://127.0.0.1:8899
```
(Não abrir Simple Browser — Humberto usa ANTIGRAVITY. Só informar a URL.)

## Estado atual (2026-07-20)

**Pronto:**
- App completo: boas-vindas → perfil → intro → questionário (1 pergunta/tela) → resultado (mapa por área + próximos passos).
- Dois instrumentos: **AQ-10** (adulto, fiel) e **M-CHAT-R/F** (criança, *itens adaptados p/ protótipo* + scoring oficial).
- **Papel timbrado** em PDF (via impressão) com rodapé IDASAM + MAZARI CORP.
- **Spinner** de boot (reaproveitado ao gerar PDF).
- Card **telemedicina "em breve"**.
- **Ajustes sensoriais** (reduzir movimento / texto maior) + temas claro/escuro.
- Favicon, `manifest.json`, **OG 1200×630** (`assets/og-image.png`), `netlify.toml` + CSP.
- Documentação: README, CLAUDE.md, CANON, CONTEXT, ARCHITECTURE, TODO, este arquivo.

**Pendente (ver `TODO.md`):**
- Itens oficiais validados PT-BR do M-CHAT-R/F.
- Revisão profissional do conteúdo.
- Domínio próprio (se sair do subdomínio Netlify, atualizar `og:url`/`og:image`).
- Telemedicina de verdade (parceria + consentimento + CFM).

## Decisões-chave

- **Multi-perfil + autista-friendly** definidos com o Humberto como espinha do produto.
- **Estático/local-first** por privacidade (LGPD) e por calma/velocidade.
- **Orientação, não diagnóstico** — blindagem ANVISA (SaMD) + ética. Ver `CANON.md`.
- Prisma tem **identidade própria**; IDASAM/MAZARI só como crédito de parceria.

## Antes de mexer

Leia `CANON.md`. A diretriz suprema é: **nunca diagnosticar; sempre encaminhar.**

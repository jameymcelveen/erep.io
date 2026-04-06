# eRep.io

## AI-Powered Reputation Defense

**Stack:** .NET 8, React (Vite), React Native (Expo). **Production domain:** [erep.io](https://erep.io)

eRep.io is your 24/7 digital security team that protects your business from reputation-damaging reviews before they can hurt your bottom line. We use specialized AI to draft professional, brand-aligned responses, keep your Google profile optimized, and help customer trust stay resilient.

---

[![CI](https://github.com/jameymcelveen/erep.io/actions/workflows/ci.yml/badge.svg)](https://github.com/jameymcelveen/erep.io/actions/workflows/ci.yml)
![Stack](https://img.shields.io/badge/stack-.NET%208%20%7C%20React%20%7C%20Expo-512BD4?style=flat-square)

## Monorepo structure

```text
erep.io
├─ api/    — ASP.NET Core 8 Web API (namespaces: eRep.Api.*)
├─ web/    — React + Vite + pnpm
└─ mobile/ — Expo app
```

## Local dev: API ↔ web handshake

| Service | Default URL | Notes |
|--------|-------------|--------|
| API (`cd api && dotnet run`) | `http://localhost:5044` | Set in `api/Properties/launchSettings.json` |
| Web (`cd web && pnpm dev`) | `http://localhost:5173` | Vite dev server |
| Web → API | `VITE_API_URL` | Defaults to `http://localhost:5044` in `web/src/lib/api-base.ts` and `web/.env.example` |
| CORS | — | API allows origin `http://localhost:5173` in development |

Docker Compose uses the API on **port 8080**; the web service sets `VITE_API_URL=http://localhost:8080` for that layout.

## Prerequisites

- .NET 8 SDK  
- Node.js and pnpm  
- Expo Go (optional, for mobile)

## Commands

- **API:** `cd api && dotnet run`
- **Web:** `cd web && pnpm dev`
- **Mobile:** `cd mobile && pnpm start`

## License

Proprietary — © 2026 Jamey McElveen.

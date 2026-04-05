# 🛡️ Echo Rep

> **AI-Powered Reputation Defense.** Built with .NET 8, React, and React Native.

[![CI/CD](https://github.com/jameymcelveen/echo-rep/actions/workflows/main.yml/badge.svg)](https://github.com)
![Platform](https://img.shields.io/badge/Stack-.NET_Core_|_React_|_Expo-blue)
![.NET Core](https://img.shields.io/badge/.NET_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-131313?style=for-the-badge&logo=railway&logoColor=white)

## 🏗️ Monorepo Structure

- **/api**: ASP.NET Core 8 Web API. Hosted on Railway.
- **/web**: React (Vite) Frontend. Hosted on Vercel.
- **/mobile**: React Native (Expo) App.

## 🛠️ Development

### Prerequisites

- .NET 8 SDK
- Node.js & pnpm
- Expo Go (for mobile testing)

### Commands

- **Run API:** `cd api && dotnet run`
- **Run Web:** `cd web && pnpm dev`
- **Run Mobile:** `cd mobile && pnpm start`

### Project Directory Structure

```Plaintext
/echo-rep
├── .cursorrules          <-- (Rules for Cursor's behavior)
├── Gemini.md             <-- (Brain-dump for the AI's logic)
├── .editorconfig         <-- (Consistency for C# and JS)
├── README.md             <-- (Project overview)
├── /api                  <-- (.NET 8 Web API)
├── /web                  <-- (React + Vite + pnpm)
├── /docs                 <-- (Project Documentation)
└── /mobile               <-- (React Native Expo)
```

## ⚖️ License

Proprietary - © 2026 Jamey McElveen.

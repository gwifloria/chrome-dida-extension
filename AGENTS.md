# Repository Guidelines

## Project Structure & Module Organization
- `src/newtab/` hosts the new tab React entry (`App.tsx`, `main.tsx`).
- `src/background/` contains the service worker (`index.ts`) for OAuth callbacks and token refresh.
- UI and logic live under `src/components/`, `src/hooks/`, `src/contexts/`, and `src/services/`.
- Shared helpers and data are in `src/utils/`, `src/constants/`, `src/themes/`, and `src/types/`.
- Static assets are in `public/` (icons, SVGs). Builds output to `dist/` for Chrome loading.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts the Vite dev server for local UI work.
- `npm run build` runs `tsc -b` and `vite build`, producing `dist/` for the extension.
- `npm run preview` serves the production build locally.
- `npm run typecheck` checks TypeScript types without emitting.
- `npm run lint` and `npm run lint:fix` run ESLint; `npm run format` runs Prettier.
- To load the extension, open `chrome://extensions`, enable Developer Mode, and load `dist/`.

## Coding Style & Naming Conventions
- TypeScript + React with 2-space indentation (Prettier defaults).
- Components use `PascalCase` filenames (e.g., `TaskList.tsx`); hooks use `useX.ts`.
- Contexts and providers follow `XContext.tsx` naming.
- Prefer absolute imports via the `@/` alias when available.

## Testing Guidelines
- No automated test runner is configured yet. Validate changes with `npm run typecheck` and `npm run lint`.
- If adding tests, keep them near the source or under `src/` with `.test.ts`/`.test.tsx` names and document the chosen runner.

## Commit & Pull Request Guidelines
- Use Conventional Commits (commitlint config): `feat: ...`, `fix: ...`, `refactor: ...`, `docs: ...`, `style: ...`, `chore: ...`.
- PRs should include a short summary, the commands run (lint/typecheck/build), and screenshots or recordings for UI changes.
- Link related issues or store listing tasks when applicable.

## Configuration & Security
- Copy `.env.example` to `.env` and set `VITE_DIDA_CLIENT_ID` and `VITE_DIDA_CLIENT_SECRET`.
- Treat credentials as secrets; never commit `.env` files or real tokens.

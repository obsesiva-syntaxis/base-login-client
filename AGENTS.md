# AGENTS.md — base-login-client

## Stack

- **Framework:** React 18, TypeScript 4.9.5, Create React App (`react-scripts 5.0.1`)
- **Package manager:** Yarn (Berry/node-modules linker). Both `yarn.lock` and `package-lock.json` exist; prefer `yarn`.
- **State:** Zustand (active, auth). Redux Toolkit is a stub (`redux/store.ts` with empty reducers) — do not add slices unless directed.
- **Styling:** SCSS via `sass`. Each component imports `src/styles/index.scss` (aggregates config partials).
- **Forms:** Formik + Yup validation schemas.
- **HTTP:** AxiosAdapter pattern in `src/patterns/AxiosAdapter.ts`. Backend URL is hardcoded to `http://localhost:3030/api/auth/login`.
- **Routing:** React Router v6 with `<BrowserRouter>` in `index.tsx`, routes in `src/routes/Router.tsx`. Auth guard: `Protected.tsx` checks Zustand store.

## Commands

| Command | Action |
|---------|--------|
| `yarn start` | Dev server on port 3000 |
| `yarn build` | Production build to `/build` |
| `yarn test` | Jest (CRA-integrated, watch mode) |

- ESLint runs via react-scripts (extends `react-app` + `react-app/jest`). No standalone ESLint config.
- No formatter (Prettier) is set up.
- No `.env` files exist — the `.gitignore` ignores `.env.local` etc. but no template/example is provided.

## Repo quirks

- **All deps in `dependencies`:** No `devDependencies` section. Types, tooling, and testing packages are listed as regular deps.
- **No CI/CD workflows** (no `.github/workflows/`).
- **Not a monorepo** — single package `fend-uccinv`.

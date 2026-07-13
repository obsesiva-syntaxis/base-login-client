# AGENTS.md — base-login-client

## Stack

- **Framework:** React 18, TypeScript 4.9.5, Create React App (`react-scripts 5.0.1`)
- **Package manager:** Yarn (Berry/node-modules linker). Both `yarn.lock` and `package-lock.json` exist; prefer `yarn`.
- **State:** Zustand (auth).
- **Styling:** SCSS via `sass`. Each component imports `src/styles/index.scss` (aggregates config partials).
- **Forms:** Formik + Yup validation schemas.
- **HTTP:** AxiosAdapter pattern in `src/patterns/AxiosAdapter.ts`. Backend URL via `REACT_APP_API_URL` env var (default: `http://localhost:3030/api`).
- **Routing:** React Router v6 with `<BrowserRouter>` in `index.tsx`, routes in `src/routes/Router.tsx`. Auth guard: `Protected.tsx` checks Zustand store.

## Commands

| Command | Action |
|---------|--------|
| `yarn start` | Dev server on port 3000 |
| `yarn build` | Production build to `/build` |
| `yarn test` | Jest (CRA-integrated, watch mode) |
| `yarn generate:component Foo` | Scaffolding de componente con compound pattern |
| `yarn generate:component Foo --context --subs=Header,Nav,Footer` | Con context y subcomponentes |

- ESLint runs via react-scripts (extends `react-app` + `react-app/jest`). No standalone ESLint config.
- No formatter (Prettier) is set up.
- `.env` exists with `REACT_APP_API_URL=http://localhost:3030/api`. Override locally via `.env.local` (gitignored).

## Current State

- **`yarn build`** — compiles cleanly.
- **`yarn test --watchAll=false`** — **11 suites, 60 tests (3 snapshots), all passing**.
- **11 test suites:** `App.test.tsx`, `AxiosAdapter.test.tsx`, `authStore.test.ts`, `DashboardPage.test.tsx`, `ErrorBoundary.test.tsx`, `Layout.test.tsx`, `Loader.test.tsx`, `LoginPage.test.tsx`, `Protected.test.tsx`, `Router.test.tsx`, `Sidebar.test.tsx`.

## Repo quirks

- **All deps in `dependencies`:** No `devDependencies` section. Types, tooling, and testing packages are listed as regular deps.
- **Routes are lazy-loaded** via `React.lazy()` + `<Suspense>` in `src/routes/Router.tsx`.
- **Error Boundary** wraps `App` at `src/components/ErrorBoundary/ErrorBoundary.tsx`.
- **SCSS** uses `@forward` + `@use` (not `@import`) with semantic color variables (`$color-primary`, `$color-danger`, etc.).
- **No CI/CD workflows** (no `.github/workflows/`).
- **Not a monorepo** — single package `fend-uccinv`.
- **Mock pattern for AxiosAdapter:** Prefer `(AxiosAdapter.prototype as any).method = jest.fn()` over `jest.spyOn().mockImplementation()`. For axios-level mocking, use `jest.mock('axios')` with `(axios.create as jest.Mock).mockReturnValue(mockInstance)` in `beforeEach` after `jest.clearAllMocks()`.
- **JWT in tests:** Use real (but fake) JWT tokens (`header.payload.signature`) so `jwtDecode` doesn't throw. Generate with `Buffer.from(JSON.stringify(obj)).toString('base64url')`.

## AI Workflow

Always use `yarn generate:component ComponentName` to create new components
(e.g., `yarn generate:component Foo` or with subcomponents:
`yarn generate:component Sidebar --context --subs=Header,Nav,Footer`).

Before creating any plan or proposing changes, always consult the skills listed in
`.agents/skills/` (`frontend-design`, `javascript-typescript-jest`, `scss-best-practices`,
`vercel-composition-patterns`, `vercel-react-best-practices`) and reference the
relevant rules in the proposal.

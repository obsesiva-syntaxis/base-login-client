# base-login-client

Cliente web (SPA) construido con **React 18 + TypeScript** para consumir la API de [`base-login-server`](https://github.com/obsesiva-syntaxis/base-login-server): login, sesión persistida y un dashboard protegido por autenticación JWT.

## Tabla de contenidos

- [Prerrequisitos](#prerrequisitos)
- [Quick start](#quick-start)
- [Conectar con base-login-server](#conectar-con-base-login-server)
- [Flujo de autenticación](#flujo-de-autenticación)
- [Scripts disponibles](#scripts-disponibles)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Tests](#tests)

## Prerrequisitos

- [Node.js 18+](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- La API [`base-login-server`](https://github.com/obsesiva-syntaxis/base-login-server) corriendo (ver sección siguiente)

## Quick start

```bash
# 1. Clonar y entrar al proyecto
git clone <repo-url> base-login-client
cd base-login-client

# 2. Instalar dependencias
yarn install

# 3. Configurar la URL de la API (ver sección "Conectar con base-login-server")
# El repo ya trae un .env con el valor por defecto:
# REACT_APP_API_URL=http://localhost:3030/api/v1

# 4. Iniciar en modo desarrollo
yarn start
```

La app queda disponible en `http://localhost:3000`.

## Conectar con base-login-server

Este cliente **no funciona de forma aislada**: necesita que la API [`base-login-server`](https://github.com/obsesiva-syntaxis/base-login-server) esté corriendo y accesible.

### 1. Levantar la API

Sigue el [README de `base-login-server`](https://github.com/obsesiva-syntaxis/base-login-server#quick-start-docker) para levantarla con Docker:

```bash
git clone https://github.com/obsesiva-syntaxis/base-login-server
cd base-login-server
cp .env.template .env
docker compose up -d --build
```

Por defecto queda disponible en `http://localhost:3030/api/v1`.

### 2. Configurar la URL en el cliente

El cliente lee la URL base de la API desde la variable de entorno `REACT_APP_API_URL`, definida en el archivo `.env` en la raíz de este repo:

```
REACT_APP_API_URL=http://localhost:3030/api/v1
```

Si cambiaste `SERVER_PORT`, `API_PREFIX` o `API_VERSION` en el `.env` del servidor, actualiza esta URL para que coincida (por ejemplo `http://localhost:<SERVER_PORT>/<API_PREFIX>/v<API_VERSION>`).

> Si `REACT_APP_API_URL` no está definida, el cliente cae por defecto a `http://localhost:3030/api` (sin `/v1`), lo que **no** coincidirá con las rutas del servidor. Se recomienda mantener siempre la variable seteada explícitamente en el `.env`.

### 3. CORS

`base-login-server` trae `CORS_ORIGIN=*` por defecto en su `.env.template`, por lo que aceptará peticiones desde `http://localhost:3000` sin configuración adicional. Si restringes `CORS_ORIGIN` en el servidor a un dominio específico, asegúrate de incluir el origen desde el que corre este cliente.

### Endpoints consumidos

| Método | Ruta (relativa a `REACT_APP_API_URL`) | Usado en | Descripción |
| --- | --- | --- | --- |
| POST | `/auth/login` | `LoginPage` | Autentica con `email`/`password` y devuelve `{ token, user }`. El cliente rechaza el login si `user.active` es `false`. |

El resto de los endpoints del servidor (`/auth/register`, `/auth/check-status`, `/auth/logout/:id`, `/auth/private`, `/auth/private2`, `/auth/private3`) **existen en la API pero aún no están integrados en la UI** de este cliente — son candidatos naturales para las próximas pantallas (registro de usuarios, renovación de sesión, logout contra el servidor, vistas por rol).

Todas las peticiones autenticadas pasan por `AxiosAdapter` (`src/patterns/AxiosAdapter.ts`), que:

- Agrega automáticamente el header `Authorization: Bearer <token>` a cada request, tomando el token desde el store de sesión.
- Si el servidor responde `401`, limpia la sesión local y redirige a `/`.

## Flujo de autenticación

1. El usuario inicia sesión en `LoginPage` (`src/pages/LoginPage`), que llama a `POST /auth/login`.
2. La respuesta (`token` + datos del usuario) se guarda en el store de Zustand `useAuthStore` (`src/store/authStore.ts`), persistido en `localStorage` bajo la key `auth-storage`.
3. El token JWT se decodifica con `jwt-decode` para calcular su expiración (`isTokenExpired`); si al recargar la página el token ya venció, la sesión se limpia automáticamente (`onRehydrateStorage`).
4. Las rutas bajo `/dashboard` están envueltas en `Protected` (`src/routes/Protected.tsx`), que redirige a `/` si no hay usuario o si el token expiró. La ruta `/` está envuelta en `PublicRoute`, que redirige a `/dashboard` si ya hay una sesión activa.
5. Mientras el usuario navega dentro del `Layout` autenticado:
   - Un intervalo revisa cada 60 segundos si el token expiró y, de ser así, cierra la sesión.
   - `useSessionTimeout` (`src/hooks/useSessionTimeout.ts`) cierra la sesión tras **15 minutos de inactividad** (sin clics en la página).
6. "Cerrar sesión" en el sidebar limpia el store local y redirige a `/` (no llama actualmente al endpoint `GET /auth/logout/:id` del servidor).

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `yarn start` | Corre la app en modo desarrollo en `http://localhost:3000` |
| `yarn build` | Genera el build de producción en `build/` |
| `yarn test` | Corre los tests en modo watch (Jest + Testing Library) |
| `yarn eject` | Expone la configuración de Create React App (operación irreversible) |
| `yarn generate:component <Nombre>` | Genera un componente nuevo con la estructura estándar del proyecto (ver [Generador de componentes](#generador-de-componentes)) |

> `yarn generate:component` está disponible en la rama `feature/obsynth` (aún no mergeada a `main` al momento de escribir esto).

## Generador de componentes

`scripts/generate-component.js` crea componentes nuevos ya adaptados al patrón que usa el proyecto (compound components + BEM, como `Sidebar`), en vez de armar la carpeta a mano cada vez.

```bash
yarn generate:component <Nombre> [--subs=Sub1,Sub2,...] [--context]
```

- **`<Nombre>`** (requerido): nombre del componente en PascalCase (ej. `Modal`, `Table`). Falla si ya existe una carpeta con ese nombre en `src/components/`.
- **`--subs=Sub1,Sub2`** (opcional): genera subcomponentes como archivos separados (ej. `Header`, `Nav`, `Footer`), cada uno con su propio `.tsx`, `.scss` e `index.ts`, y los expone en el componente principal vía `Object.assign` (el mismo patrón compound component que `Sidebar.Header`, `Sidebar.Nav`, `Sidebar.Footer`).
- **`--context`** (opcional): además genera `<Nombre>Context.tsx` con un `createContext`/`useContext`/`Provider` de base (boilerplate a completar), y envuelve el componente raíz en ese Provider.

Ejemplo:

```bash
yarn generate:component Table --subs=Header,Row,Footer --context
```

Esto genera:

```
src/components/Table/
├── index.ts              # export { default } from './Table'
├── Table.tsx              # componente raíz + Object.assign con subcomponentes
├── Table.scss             # scaffold con @use '../../styles/index' as *
├── Table.test.tsx         # test base con Testing Library (data-testid)
├── TableContext.tsx        # contexto (por --context)
├── Header/
│   ├── index.ts
│   ├── Header.tsx
│   └── Header.scss
├── Row/
│   └── ...
└── Footer/
    └── ...
```

Convenciones que aplica automáticamente el generador:

- Clase raíz en kebab-case derivada del nombre (`Table` → `.table`), y clases de subcomponentes en BEM (`.table__header`).
- Cada archivo generado incluye un `data-testid` igual a su clase CSS, para que el test base pueda encontrarlo con `getByTestId`.
- Los `.scss` generados ya importan las variables/mixins globales (`@use '../../styles/index' as *`).
- El test generado solo verifica que el componente renderiza; hay que completar los casos reales.

## Stack tecnológico

- **Framework**: React 18 + TypeScript, bootstrapped con Create React App (`react-scripts` 5)
- **Ruteo**: React Router 6, con code-splitting (`lazy`/`Suspense`) por página
- **Estado de sesión**: Zustand 5 con middleware `persist` (localStorage)
- **HTTP**: Axios, envuelto en un adaptador propio (`AxiosAdapter`) con interceptores de auth
- **Formularios**: Formik + Yup para validación
- **JWT**: `jwt-decode` para leer la expiración del token en el cliente
- **Notificaciones**: react-hot-toast
- **Estilos**: Sass (SCSS modular por componente) + iconos vía Font Awesome Kit (CDN, cargado en `public/index.html`)
- **Tests**: Jest + React Testing Library

## Estructura del proyecto

```
src/
├── Layout/                # Layout autenticado (sidebar + outlet), revisa expiración de token
├── components/
│   ├── ErrorBoundary/      # Boundary de errores de React
│   ├── Loader/             # Spinner de carga
│   └── Sidebar/             # Sidebar con subcomponentes (Header, Nav, Footer) vía compound components
├── hooks/
│   └── useSessionTimeout.ts   # Cierra sesión tras inactividad
├── interfaces/
│   └── auth/auth.interface.ts # Tipos del usuario autenticado
├── pages/
│   ├── LoginPage/          # Formulario de login, llama a /auth/login
│   └── DashboardPage/      # Página protegida de ejemplo
├── patterns/
│   └── AxiosAdapter.ts     # Cliente HTTP con interceptores (Bearer token, manejo de 401)
├── routes/
│   ├── Protected.tsx       # Guard de rutas autenticadas
│   ├── PublicRoute.tsx     # Guard de rutas públicas (redirige si ya hay sesión)
│   └── Router.tsx          # Definición de rutas
├── store/
│   └── authStore.ts        # Store de sesión (Zustand + persist)
├── styles/                 # Variables y mixins SCSS globales
├── App.tsx                 # Punto de entrada de la app (Router + Toaster + ErrorBoundary)
└── index.tsx                # Entry point de React
```

## Tests

```bash
yarn test
```

Corre los tests unitarios/de componentes con Jest y React Testing Library en modo watch.

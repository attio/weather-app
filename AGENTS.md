# AGENTS.md

This file provides guidance to AI agents who are working on the code in this repository.

## Context

This repository contains an app built with the Attio App SDK.

### What the app does

Weather integration for Attio. It shows the current weather forecast for a Person or Company record directly on the record page, and lets users open a 7-day forecast dialog for the same record. Location is resolved from the record's own address, falling back to the associated company's address for People. Forecast data comes from the free Open-Meteo API — there is no external connection or API key to configure. A workspace setting lets users choose between Celsius and Fahrenheit.

### What is the App SDK?

The App SDK is a set of components and functionality to build apps that are embedded directly in the Attio CRM platform.

#### App SDK capabilities

- Use React to render components provided by the `attio/client` package.
- Run server-side code and make API calls to external services using `.server.ts` files.
- Store API tokens using the connections system.
- Receive incoming requests from third-party services via webhooks.
- Subscribe to events e.g. connection.added
- Manage form rendering, validation and submission with `useForm()`.
- Manage data fetching and async caching with `useAsyncCache()` and `useQuery()`.

## App SDK entry points in use

- **Record widget** — `current-weather-widget` (`src/record/widgets/current-forecast.tsx`) renders the current forecast on Person and Company record pages, resolving location via `useRecordLocation()`.
- **Record action** — `show-weather-forecast` (`src/record/actions/weather-forecast.tsx`) opens a dialog (`showDialog()`) with a 7-day forecast for Person and Company records.
- **Workspace settings** — `src/settings/workspace-settings.tsx` + `src/app.settings.ts` expose a single `temperature_unit` setting (Celsius/Fahrenheit) via `useWorkspaceSettingsForm()`.

> No workflow blocks, bulk actions, webhook triggers, or call-recording text-selection actions are registered.

## Source folder structure

| Path                  | Description                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `src/app.ts`          | App manifest — registers the record action, record widget, and workspace settings.                                 |
| `src/app.settings.ts` | Workspace settings schema (`temperature_unit`).                                                                    |
| `src/record/widgets/` | The current-forecast record widget.                                                                                |
| `src/record/actions/` | The show-weather-forecast record action, which opens the 7-day forecast dialog.                                    |
| `src/settings/`       | Workspace settings form UI.                                                                                        |
| `src/components/`     | Shared UI: the 7-day forecast dialog and the temperature badge.                                                    |
| `src/hooks/`          | React hooks — `useRecordLocation` (person/company location via GraphQL), `useCurrentForecast`, `useDailyForecast`. |
| `src/open-weather/`   | Open-Meteo API client (`*.server.ts`), Zod response schemas, and API error handling.                               |
| `src/graphql/`        | GraphQL queries used to read a record's location (and its company's, as a fallback) from Attio.                    |
| `src/utils/`          | Shared helpers — URL building, location extraction/formatting, WMO weather-code lookup, react-query provider.      |

## External service

- **Service:** Open-Meteo (free weather forecast API, no API key required).
- **API:** REST — `https://api.open-meteo.com` (docs: https://open-meteo.com/en/docs).
- **Auth:** none — all requests are unauthenticated.
- Server-side fetchers live in `src/open-weather/*.server.ts` and validate responses with Zod schemas in `src/open-weather/schema.ts`.

## Environment

Code for the app may run either in a client-side or server-side context.

### Client-side code

Client-side code runs in the browser. However, it runs inside a safe sandbox, using a custom JS runtime. This means that:

- You MUST NOT render HTML tags directly e.g. `<div>Hello</div>`. Instead, you MUST only use components provided by the App SDK.
- You MUST NOT use custom styles or CSS. Only use the pre-styled components provided by the App SDK.
- You MUST NOT try to read the DOM directly.
- Some browser APIs may not be available.
- `fetch` calls are not allowed. You MUST NOT call `fetch` directly and should instead use `fetch` via server-side functions.

Files which render React components MUST use the `.tsx` extension.

### Server-side code

Server-side code runs in files ending in:

- `.server.ts`
- `.webhook.ts`
- `.event.ts`

Workflow block files will also run in the server (excluding configurators).

Server-side code DOES NOT run in Node.js but instead in a custom JS runtime. While many Node.js APIs are supported, some are not and you may need to factor this into your decision to use certain packages.

## Using the Attio App SDK

Attio provides three packages to help you build apps:

1. `attio/client` - for client-side imports
2. `attio/server` - for server-side imports
3. `attio` - for shared/environment-agnostic imports

IMPORTANT: Before importing from these packages, you MUST always check one of the following to confirm that your import is correct:

1. Existing examples in the codebase
2. TypeScript type definitions and JSDoc strings for the package
3. The Attio SDK documentation

If you are unsure about an import, always check explicitly and do not guess.

## Coding guidelines

- You SHOULD use Zod to validate data from public APIs.
- You SHOULD only include properties in Zod schemas that we explicitly need.
- You SHOULD use try/catch around calls to `.json()`.
- You SHOULD use console.error to capture information about unexpected errors.
- You MUST NOT log sensitive information such as email addresses or passwords.
- You MUST handle API errors gracefully. Do not throw an error within a React component, but instead return a clear fallback UI.
- You SHOULD prefer named arguments over positional arguments when using 3 or more arguments.
- You MUST NOT use `any` when typing your code. Type errors MUST be fixed properly as usage of `any` is a likely source of bugs.
- You SHOULD order functions/values within code so that all values are defined before being used. Default export should go at the bottom of a file.

### App-specific guidelines

- `<Widget.TextWidget>` only allows `<Widget.Title/>`, `<Badge/>`, `<Widget.Text.Primary/>`, `<Widget.Text.Secondary/>`, or a custom component as direct literal children (enforced by the `attio/widget-text-children` lint rule). To include a `<Widget.Decoration>` alongside text children, wrap `<Widget.TextWidget>` in a small custom component that takes `children` — see `WeatherTextWidget` in `src/record/widgets/current-forecast.tsx`.
- `useRecordLocation()` always calls both `usePersonLocation()` and `useCompanyLocation()` unconditionally to satisfy the Rules of Hooks, then picks the right result based on `object`. Keep both hooks called on every render if you touch this function.
- Since Open-Meteo requires no auth, there is no connection/token handling in this app — do not add one unless the app starts calling an authenticated endpoint.

### Error messages (user-facing)

- Never dump raw JSON, HTTP status codes, or square brackets in UI error messages.
- Never expose transport-layer details — say "An unexpected error occurred when calling the weather API" not "503 from Open-Meteo".

### Testing

- Where appropriate, use Vitest to run tests.
- Aim to implement unit testing where it helps increase confidence in the correctness of code.
- Do not test React components using react testing library or similar.
- When passing functions/classes to describe, pass the value directly, do not specify a name in quotes e.g. `describe(myFn, () => {/* ... */})`, not `describe("myFn", () => {/* ... */})`.

## Validation

- You MUST validate all your changes using the commands provided in package.json.
- Run and fix lint rules: `pnpm run lint:fix`
- Validate unused code: `pnpm run knip`
- Run tests: `pnpm run test`
- Validate the build: `pnpm run build`

# Weather

Attio app showing weather forecasts on record pages, powered by [Open-Meteo](https://open-meteo.com).

## Overview

The Weather app resolves a Person or Company record's location and shows the current forecast right on the record page. A record action opens a 7-day forecast dialog for the same record. No connection or API key is required — Open-Meteo is a free, unauthenticated API.

## Features

- Record widget showing the current temperature and conditions for a Person or Company
- Record action opening a 7-day forecast dialog (temperature, precipitation, wind)
- Falls back to a Person's company location when the person has no location of their own
- Workspace setting to choose Celsius or Fahrenheit

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm run dev
```

## Commands

| Command                 | Description              |
| ----------------------- | ------------------------ |
| `pnpm run dev`          | Start dev server         |
| `pnpm run build`        | Build + type-check       |
| `pnpm run lint`         | Run ESLint               |
| `pnpm run lint:fix`     | Run ESLint with auto-fix |
| `pnpm run format`       | Format with Prettier     |
| `pnpm run format:check` | Check formatting         |
| `pnpm run test`         | Run tests                |
| `pnpm run knip`         | Check for dead code      |

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

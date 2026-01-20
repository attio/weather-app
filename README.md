# Weather App for Attio

A demonstration app built with the Attio App SDK to showcase best practices and capabilities.

>[!NOTE] This is a dummy app designed to demonstrate how to build apps using the Attio SDK and follow best practices.

## Overview

This example app integrates weather forecasting into Attio, allowing you to view current weather conditions and 7-day forecasts for any location directly from your CRM records. It demonstrates key SDK features including record widgets, server-side API calls, form handling, and data validation.

## Features

- **Current Weather Widget**: View real-time weather conditions including temperature and weather codes for any location
- **7-Day Forecast**: Access detailed daily forecasts with temperature ranges, precipitation data, and wind speeds
- **Temperature Unit Toggle**: Switch between Celsius and Fahrenheit based on your preference
- **Type-Safe API Integration**: Demonstrates proper use of Zod schemas for external API validation
- **Error Handling**: Shows graceful error handling and fallback UI patterns

## Source Folder Structure

| Path | Description |
|------|-------------|
| `src/assets` | Static assets |
| `src/components` | Shared React components using App SDK components |
| `src/graphql` | GraphQL queries for the [Attio GraphQL schema](https://docs.attio.com/sdk/graphql/graphql) |
| `src/open-weather` | Open-Meteo API integration including schemas and types |
| `src/record/widgets` | [Record widgets](https://docs.attio.com/sdk/entry-points/record-widget) |
| `src/server` | Server-side functions for external API calls |
| `src/utils` | Shared utility functions |

## Development

### Install Dependencies

```bash
npm install
```

### Dev Mode

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## SDK Best Practices Demonstrated

This app showcases several Attio SDK best practices:

- ✅ Proper separation of client-side (`.tsx`) and server-side (`.server.ts`) code
- ✅ Using Zod schemas to validate external API responses
- ✅ Graceful error handling with user-friendly fallback UI
- ✅ Using App SDK components instead of raw HTML
- ✅ Proper TypeScript typing without `any`
- ✅ Named arguments for functions with multiple parameters
- ✅ Structured folder organization by feature and domain

import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import type {PropsWithChildren} from "react"

/**
 * Shared QueryClient instance for all weather-related requests.
 * This ensures cache sharing across different components (dialogs, widgets, etc.)
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Stale time of 5 minutes for weather data
            staleTime: 5 * 60 * 1000,
            // Cache time of 10 minutes
            gcTime: 10 * 60 * 1000,
        },
    },
})

/**
 * Provider component that wraps children with QueryClientProvider.
 * Use this to share the same QueryClient instance across the app.
 */
export function QueryProvider({children}: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

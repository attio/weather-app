import {useSuspenseQuery} from "@tanstack/react-query"
import getDailyForecast from "../open-weather/get-daily-forecast.server"
import type {DailyForecastResponse, TemperatureUnit} from "../open-weather/schema"

interface UseDailyForecastParams {
    latitude: number
    longitude: number
    temperature_unit: TemperatureUnit
}

interface UseDailyForecastOptions {
    enabled?: boolean
}

/**
 * Hook to fetch 7-day weather forecast data.
 */
export function useDailyForecast(
    {latitude, longitude, temperature_unit}: UseDailyForecastParams,
    {enabled = true}: UseDailyForecastOptions = {}
) {
    return useSuspenseQuery<DailyForecastResponse | null>({
        queryFn: () => (enabled ? getDailyForecast(latitude, longitude, temperature_unit) : null),
        queryKey: ["daily-weather-forecast", latitude, longitude, temperature_unit],
    })
}

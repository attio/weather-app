import {useSuspenseQuery} from "@tanstack/react-query"
import getDailyForecast from "../open-weather/get-daily-forecast.server"
import type {DailyForecastResponse, TemperatureUnit} from "../open-weather/schema"

interface UseDailyForecastParams {
    latitude: number
    longitude: number
    temperature_unit: TemperatureUnit
}

/**
 * Hook to fetch 7-day weather forecast data.
 */
export function useDailyForecast({
    latitude,
    longitude,
    temperature_unit,
}: UseDailyForecastParams) {
    return useSuspenseQuery<DailyForecastResponse>({
        queryFn: () => getDailyForecast(latitude, longitude, temperature_unit),
        queryKey: ["daily-weather-forecast", latitude, longitude, temperature_unit],
    })
}

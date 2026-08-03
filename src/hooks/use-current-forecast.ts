import {useWorkspaceSettings} from "attio/client"
import {useSuspenseQuery} from "@tanstack/react-query"
import getWeatherForecast from "../open-weather/get-weather-forecast.server"
import type {CurrentForecastResponse, TemperatureUnit} from "../open-weather/schema"

interface UseCurrentForecastParams {
    latitude: number
    longitude: number
}

interface UseCurrentForecastOptions {
    enabled?: boolean
}

/**
 * Hook to fetch current weather forecast data.
 * Automatically uses the workspace temperature unit setting.
 */
export function useCurrentForecast(
    {latitude, longitude}: UseCurrentForecastParams,
    {enabled = true}: UseCurrentForecastOptions = {}
) {
    const {temperature_unit} = useWorkspaceSettings()

    return useSuspenseQuery<CurrentForecastResponse | null>({
        queryFn: () =>
            enabled
                ? getWeatherForecast({
                      latitude,
                      longitude,
                      temperature_unit: (temperature_unit as TemperatureUnit) ?? "fahrenheit",
                  })
                : null,
        queryKey: ["current-weather", latitude, longitude, temperature_unit],
    })
}

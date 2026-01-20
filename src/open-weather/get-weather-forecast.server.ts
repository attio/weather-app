import {
    CurrentForecastResponseSchema,
    type CurrentForecastResponse,
    type ForecastProps,
} from "./schema"
import {buildUrl} from "../utils/url"

/**
 * Fetches current weather forecast from Open-Meteo API.
 *
 * @see https://open-meteo.com/en/docs
 */
export default async function getWeatherForecast({
    latitude,
    longitude,
    temperature_unit = "celsius",
}: ForecastProps): Promise<CurrentForecastResponse> {
    try {
        console.log(`[Current Weather] Fetching current forecast for ${latitude}, ${longitude}`)

        const url = buildUrl("https://api.open-meteo.com/v1/forecast", {
            latitude,
            longitude,
            temperature_unit: temperature_unit === "celsius" ? null : temperature_unit,
            current: ["temperature_2m", "weather_code"],
            format: "json",
            timeformat: "unixtime",
        })

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`)
        }

        const data = await response.json()
        const validatedResponse = CurrentForecastResponseSchema.parse(data)

        console.log(`[Current Weather] Successfully fetched current forecast data`)

        return validatedResponse
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        console.error(`[Current Weather Error] ${errorMessage}`)
        throw new Error(`Failed to fetch current weather forecast: ${errorMessage}`)
    }
}

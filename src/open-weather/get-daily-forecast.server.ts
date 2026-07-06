import {createLogger} from "../utils/logger"
import {buildUrl} from "../utils/url"
import {handleApiError} from "./handle-api-error"
import {
    type DailyForecastResponse,
    DailyForecastResponseSchema,
    type TemperatureUnit,
} from "./schema"

const logger = createLogger("get-daily-forecast")

/**
 * Fetches 7-day weather forecast from Open-Meteo API.
 *
 * @see https://open-meteo.com/en/docs
 * @see https://open-meteo.com/en/docs#errors
 */
export default async function getDailyForecast(
    latitude: number,
    longitude: number,
    temperature_unit: TemperatureUnit
): Promise<DailyForecastResponse> {
    try {
        logger.log(`Fetching 7-day forecast for ${latitude}, ${longitude}`)

        const url = buildUrl("https://api.open-meteo.com/v1/forecast", {
            latitude,
            longitude,
            daily: [
                "weather_code",
                "precipitation_sum",
                "precipitation_probability_max",
                "temperature_2m_max",
                "temperature_2m_min",
                "wind_speed_10m_max",
            ],
            format: "json",
            timeformat: "unixtime",
            temperature_unit: temperature_unit === "celsius" ? null : temperature_unit,
        })

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })

        if (!response.ok) {
            await handleApiError(response)
        }

        const data = await response.json()
        const validatedResponse = DailyForecastResponseSchema.parse(data)

        logger.log(`Successfully fetched forecast data`)

        return validatedResponse
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        logger.error(errorMessage)
        throw new Error(`Failed to fetch weather forecast: ${errorMessage}`)
    }
}

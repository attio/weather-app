import {z} from "zod"

/**
 * Weather Forecast Schemas
 *
 * Zod validation open-weather for weather forecast API requests and responses.
 * These open-weather ensure type safety and runtime validation for weather data.
 *
 * @see https://open-meteo.com/en/docs#api_documentation
 */

/**
 * Temperature unit type - either Celsius or Fahrenheit
 */
export const TemperatureUnitSchema = z.enum(["celsius", "fahrenheit"])

export type TemperatureUnit = z.infer<typeof TemperatureUnitSchema>

export const ForecastPropsSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    temperature_unit: TemperatureUnitSchema,
})

export const CurrentUnitsSchema = z.object({
    time: z.string(),
    interval: z.string(),
    temperature_2m: z.string(),
    weather_code: z.string(),
})

export const CurrentDataSchema = z.object({
    time: z.number(),
    interval: z.number(),
    temperature_2m: z.number(),
    weather_code: z.number(),
})

export const CurrentForecastResponseSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    generationtime_ms: z.number(),
    utc_offset_seconds: z.number(),
    timezone: z.string(),
    timezone_abbreviation: z.string(),
    elevation: z.number(),
    current_units: CurrentUnitsSchema,
    current: CurrentDataSchema,
})

export type ForecastProps = z.infer<typeof ForecastPropsSchema>
export type CurrentForecastResponse = z.infer<typeof CurrentForecastResponseSchema>

// Daily Forecast Schemas for 7-day forecast
export const DailyUnitsSchema = z.object({
    time: z.string(),
    weather_code: z.string(),
    precipitation_sum: z.string(),
    precipitation_probability_max: z.string(),
    temperature_2m_max: z.string(),
    temperature_2m_min: z.string(),
    wind_speed_10m_max: z.string(),
})

export const DailyForecastSchema = z.object({
    /** Array of unix timestamps */
    time: z.array(z.number()),
    /** WMO Weather interpretation codes */
    weather_code: z.array(z.number()),
    /** Total precipitation sum in mm */
    precipitation_sum: z.array(z.number()),
    /** Maximum precipitation probability in % */
    precipitation_probability_max: z.array(z.number()),
    /** Maximum daily temperature at 2m in temperature_unit */
    temperature_2m_max: z.array(z.number()),
    /** Minimum daily temperature at 2m in temperature_unit */
    temperature_2m_min: z.array(z.number()),
    /** Maximum wind speed at 10m */
    wind_speed_10m_max: z.array(z.number()),
})

export const DailyForecastResponseSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    timezone: z.string(),
    daily_units: DailyUnitsSchema,
    daily: DailyForecastSchema,
})

export type DailyForecastResponse = z.infer<typeof DailyForecastResponseSchema>

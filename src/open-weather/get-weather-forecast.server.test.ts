import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"
import getWeatherForecast from "./get-weather-forecast.server"
import type {CurrentForecastResponse} from "./schema"

const validResponse: CurrentForecastResponse = {
    latitude: 51.5,
    longitude: -0.12,
    generationtime_ms: 0.1,
    utc_offset_seconds: 0,
    timezone: "GMT",
    timezone_abbreviation: "GMT",
    elevation: 25,
    current_units: {
        time: "unixtime",
        interval: "seconds",
        temperature_2m: "°C",
        weather_code: "wmo code",
    },
    current: {time: 1751400000, interval: 900, temperature_2m: 18.5, weather_code: 3},
}

const fetchMock = vi.fn()

describe(getWeatherForecast, () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", fetchMock)
        vi.spyOn(console, "log").mockImplementation(() => undefined)
        vi.spyOn(console, "error").mockImplementation(() => undefined)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        fetchMock.mockReset()
    })

    it("fetches and returns the validated current forecast", async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify(validResponse), {status: 200}))

        const result = await getWeatherForecast({
            latitude: 51.5,
            longitude: -0.12,
            temperature_unit: "celsius",
        })

        expect(result).toEqual(validResponse)
        const url = new URL(fetchMock.mock.calls[0][0] as string)
        expect(url.origin + url.pathname).toBe("https://api.open-meteo.com/v1/forecast")
        expect(url.searchParams.get("latitude")).toBe("51.5")
        expect(url.searchParams.get("longitude")).toBe("-0.12")
        expect(url.searchParams.getAll("current")).toEqual(["temperature_2m", "weather_code"])
        // celsius is Open-Meteo's default — must not be sent explicitly
        expect(url.searchParams.has("temperature_unit")).toBe(false)
    })

    it("sends the temperature unit when fahrenheit is requested", async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify(validResponse), {status: 200}))

        await getWeatherForecast({latitude: 51.5, longitude: -0.12, temperature_unit: "fahrenheit"})

        const url = new URL(fetchMock.mock.calls[0][0] as string)
        expect(url.searchParams.get("temperature_unit")).toBe("fahrenheit")
    })

    it("wraps API errors in a user-friendly message", async () => {
        fetchMock.mockResolvedValue(new Response("oops", {status: 503}))

        await expect(
            getWeatherForecast({latitude: 51.5, longitude: -0.12, temperature_unit: "celsius"})
        ).rejects.toThrow(
            "Failed to fetch current weather forecast: Weather service temporarily unavailable. Please try again later."
        )
    })

    it("rejects responses that fail schema validation", async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify({latitude: 51.5}), {status: 200}))

        await expect(
            getWeatherForecast({latitude: 51.5, longitude: -0.12, temperature_unit: "celsius"})
        ).rejects.toThrow("Failed to fetch current weather forecast:")
    })
})

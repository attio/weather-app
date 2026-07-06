import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"
import getDailyForecast from "./get-daily-forecast.server"
import type {DailyForecastResponse} from "./schema"

const validResponse: DailyForecastResponse = {
    latitude: 51.5,
    longitude: -0.12,
    timezone: "GMT",
    daily_units: {
        time: "unixtime",
        weather_code: "wmo code",
        precipitation_sum: "mm",
        precipitation_probability_max: "%",
        temperature_2m_max: "°C",
        temperature_2m_min: "°C",
        wind_speed_10m_max: "km/h",
    },
    daily: {
        time: [1751400000],
        weather_code: [61],
        precipitation_sum: [2.4],
        precipitation_probability_max: [80],
        temperature_2m_max: [21.3],
        temperature_2m_min: [12.1],
        wind_speed_10m_max: [14.2],
    },
}

const fetchMock = vi.fn()

describe(getDailyForecast, () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", fetchMock)
        vi.spyOn(console, "log").mockImplementation(() => undefined)
        vi.spyOn(console, "error").mockImplementation(() => undefined)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        fetchMock.mockReset()
    })

    it("fetches and returns the validated daily forecast", async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify(validResponse), {status: 200}))

        const result = await getDailyForecast(51.5, -0.12, "celsius")

        expect(result).toEqual(validResponse)
        const url = new URL(fetchMock.mock.calls[0][0] as string)
        expect(url.origin + url.pathname).toBe("https://api.open-meteo.com/v1/forecast")
        expect(url.searchParams.getAll("daily")).toEqual([
            "weather_code",
            "precipitation_sum",
            "precipitation_probability_max",
            "temperature_2m_max",
            "temperature_2m_min",
            "wind_speed_10m_max",
        ])
        // celsius is Open-Meteo's default — must not be sent explicitly
        expect(url.searchParams.has("temperature_unit")).toBe(false)
    })

    it("sends the temperature unit when fahrenheit is requested", async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify(validResponse), {status: 200}))

        await getDailyForecast(51.5, -0.12, "fahrenheit")

        const url = new URL(fetchMock.mock.calls[0][0] as string)
        expect(url.searchParams.get("temperature_unit")).toBe("fahrenheit")
    })

    it("wraps API errors in a user-friendly message", async () => {
        fetchMock.mockResolvedValue(new Response("oops", {status: 429}))

        await expect(getDailyForecast(51.5, -0.12, "celsius")).rejects.toThrow(
            "Failed to fetch weather forecast: Weather service rate limit exceeded. Please try again later."
        )
    })

    it("rejects responses that fail schema validation", async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify({latitude: 51.5}), {status: 200}))

        await expect(getDailyForecast(51.5, -0.12, "celsius")).rejects.toThrow(
            "Failed to fetch weather forecast:"
        )
    })
})

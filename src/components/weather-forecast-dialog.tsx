import {useSuspenseQuery} from "@tanstack/react-query"
import {
    Divider,
    Experimental_Table,
    experimental_useWorkspaceSettings,
    Link,
    LoadingState,
    Section,
    Typography,
} from "attio/client"
import {Suspense} from "react"
import {useRecordLocation} from "../hooks/use-record-location"
import getDailyForecast from "../open-weather/get-daily-forecast.server"
import type {DailyForecastResponse, TemperatureUnit} from "../open-weather/schema"
import {WmoCodesMap} from "../utils/wmo-codes"
import {normalizeTemperatureScale} from "../utils/converter"
import {formatDate} from "../utils/date"
import {QueryProvider} from "../utils/query-client"
import {TemperatureBadge} from "./temperature-badge"

/**
 * Reusable table headers for weather forecast table
 */
function ForecastTableHeader() {
    return (
        <Experimental_Table.Header>
            <Experimental_Table.HeaderCell>Date</Experimental_Table.HeaderCell>
            <Experimental_Table.HeaderCell>Weather</Experimental_Table.HeaderCell>
            <Experimental_Table.HeaderCell>Temp. (Max/Min)</Experimental_Table.HeaderCell>
            <Experimental_Table.HeaderCell>Precipitation</Experimental_Table.HeaderCell>
            <Experimental_Table.HeaderCell>Wind</Experimental_Table.HeaderCell>
        </Experimental_Table.Header>
    )
}

/**
 * Footer with attribution to Open-Meteo
 */
function ForecastFooter() {
    return (
        <>
            <Divider />
            <Typography.Body>
                Weather data provided by <Link href="https://open-meteo.com">open-meteo.com</Link>
            </Typography.Body>
        </>
    )
}

interface WeatherForecastDialogProps {
    object: string
    recordId: string
}

function useDailyForecast(
    {latitude, longitude, temperature_unit}: {latitude: number; longitude: number; temperature_unit: TemperatureUnit},
    {enabled = true}
) {
    return useSuspenseQuery<DailyForecastResponse | null>({
        queryFn: () => (enabled ? getDailyForecast(latitude, longitude, temperature_unit) : null),
        queryKey: ["daily-weather-forecast", latitude, longitude, temperature_unit],
    })
}

function ForecastContent({
    latitude,
    longitude,
    location,
}: {
    latitude: number
    longitude: number
    location: string | null
}) {
    const {temperatureUnit} = experimental_useWorkspaceSettings()
    const temperature_unit = normalizeTemperatureScale(temperatureUnit)

    const {data} = useDailyForecast(
        {latitude, longitude, temperature_unit},
        {enabled: Boolean(latitude && longitude)}
    )

    if (!data) {
        return <Section title="Weather Forecast">No forecast data available.</Section>
    }

    const forecast = data

    const locationTitle = location ? `Location: ${location}` : "Location"

    return (
        <Section title={locationTitle}>
            <Experimental_Table>
                <ForecastTableHeader />
                <Experimental_Table.Body>
                    {forecast.daily.time.map((timestamp: number, index: number) => {
                        const weatherCode = forecast.daily.weather_code[index]
                        const tempMax = Math.round(forecast.daily.temperature_2m_max[index])
                        const tempMin = Math.round(forecast.daily.temperature_2m_min[index])
                        const precipitation = forecast.daily.precipitation_sum[index]
                        const precipProb = forecast.daily.precipitation_probability_max[index]
                        const windSpeed = Math.round(forecast.daily.wind_speed_10m_max[index])

                        const weatherInfo = WmoCodesMap.get(weatherCode)
                        const weatherEmoji = weatherInfo?.emoji || "🌈"
                        const weatherDesc = weatherInfo?.description || "Unknown"

                        return (
                            <Experimental_Table.Row key={timestamp}>
                                <Experimental_Table.Cell>
                                    {formatDate(timestamp)}
                                </Experimental_Table.Cell>
                                <Experimental_Table.Cell>
                                    {weatherEmoji} {weatherDesc}
                                </Experimental_Table.Cell>
                                <Experimental_Table.Cell>
                                    <TemperatureBadge temperature={tempMax} />
                                    <TemperatureBadge temperature={tempMin} />
                                </Experimental_Table.Cell>
                                <Experimental_Table.Cell>
                                    {precipitation.toPrecision(2)}{" "}
                                    {forecast.daily_units.precipitation_sum} ({precipProb}%)
                                </Experimental_Table.Cell>
                                <Experimental_Table.Cell>
                                    {windSpeed} {forecast.daily_units.wind_speed_10m_max}
                                </Experimental_Table.Cell>
                            </Experimental_Table.Row>
                        )
                    })}
                </Experimental_Table.Body>
            </Experimental_Table>
            <ForecastFooter />
        </Section>
    )
}

export default function WeatherForecastDialog({object, recordId}: WeatherForecastDialogProps) {
    // Fetch location data using the record location hook
    const {latitude, longitude, hasValidLocation, location} = useRecordLocation(object, recordId)

    // Handle no location data
    if (!hasValidLocation || !latitude || !longitude) {
        return (
            <Section title="Weather Forecast">No location data available for this record.</Section>
        )
    }

    return (
        <QueryProvider>
            <Suspense fallback={<LoadingState />}>
                <ForecastContent
                    latitude={latitude}
                    longitude={longitude}
                    location={location}
                />
            </Suspense>
        </QueryProvider>
    )
}

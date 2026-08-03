import {Suspense} from "react"
import {
    Divider,
    Table,
    useWorkspaceSettings,
    Link,
    LoadingState,
    Section,
    Typography,
} from "attio/client"
import {format} from "date-fns"
import {useDailyForecast} from "../hooks/use-daily-forecast"
import {useRecordLocation} from "../hooks/use-record-location"
import type {TemperatureUnit} from "../open-weather/schema"
import {QueryProvider} from "../utils/query-client"
import {WmoCodesMap} from "../utils/wmo-codes"
import {TemperatureBadge} from "./temperature-badge"

/**
 * Reusable table headers for weather forecast table
 */
function ForecastTableHeader() {
    return (
        <Table.Header>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Weather</Table.HeaderCell>
            <Table.HeaderCell>Temp. (Max/Min)</Table.HeaderCell>
            <Table.HeaderCell>Precipitation</Table.HeaderCell>
            <Table.HeaderCell>Wind</Table.HeaderCell>
        </Table.Header>
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

function ForecastContent({
    latitude,
    longitude,
    location,
}: {
    latitude: number
    longitude: number
    location: string
}) {
    const {temperature_unit} = useWorkspaceSettings()

    const {data} = useDailyForecast({
        latitude,
        longitude,
        temperature_unit: (temperature_unit as TemperatureUnit) ?? "fahrenheit",
    })

    if (!data) {
        return <Section title="Weather Forecast">No forecast data available.</Section>
    }

    const forecast = data

    const locationTitle = `Location: ${location}`

    return (
        <Section title={locationTitle}>
            <Table>
                <ForecastTableHeader />
                <Table.Body>
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
                            <Table.Row key={timestamp}>
                                <Table.Cell>
                                    {format(new Date(timestamp * 1000), "EEE, d MMM")}
                                </Table.Cell>
                                <Table.Cell>
                                    {weatherEmoji} {weatherDesc}
                                </Table.Cell>
                                <Table.Cell>
                                    <TemperatureBadge temperature={tempMax} />
                                    <TemperatureBadge temperature={tempMin} />
                                </Table.Cell>
                                <Table.Cell>
                                    {precipitation.toPrecision(2)}{" "}
                                    {forecast.daily_units.precipitation_sum} ({precipProb}%)
                                </Table.Cell>
                                <Table.Cell>
                                    {windSpeed} {forecast.daily_units.wind_speed_10m_max}
                                </Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table>
            <ForecastFooter />
        </Section>
    )
}

export default function WeatherForecastDialog({object, recordId}: WeatherForecastDialogProps) {
    const recordLocation = useRecordLocation(object, recordId)

    if (!recordLocation) {
        return (
            <Section title="Weather Forecast">No location data available for this record.</Section>
        )
    }

    return (
        <QueryProvider>
            <Suspense fallback={<LoadingState />}>
                <ForecastContent
                    latitude={recordLocation.latitude}
                    longitude={recordLocation.longitude}
                    location={recordLocation.location}
                />
            </Suspense>
        </QueryProvider>
    )
}

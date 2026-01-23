import {Suspense} from "react"
import type {App} from "attio"
import {experimental_useWorkspaceSettings, showToast, Widget} from "attio/client"
import {useSuspenseQuery} from "@tanstack/react-query"
import {TemperatureBadge} from "../../components/temperature-badge"
import {useRecordLocation} from "../../hooks/use-record-location"
import getWeatherForecast from "../../open-weather/get-weather-forecast.server"
import type {CurrentForecastResponse, TemperatureUnit} from "../../open-weather/schema"
import {QueryProvider} from "../../utils/query-client"
import {WmoCodesMap} from "../../utils/wmo-codes"

interface WeatherWidgetProps {
    id: string
    object: string
}

function useCurrentForecast(
    {latitude, longitude}: {latitude: number; longitude: number},
    {enabled = true}
) {
    const {temperature_unit = "fahrenheit"} = experimental_useWorkspaceSettings()

    return useSuspenseQuery<CurrentForecastResponse | null>({
        queryFn: () =>
            enabled
                ? getWeatherForecast({
                      latitude,
                      longitude,
                      temperature_unit: temperature_unit as TemperatureUnit,
                  })
                : null,
        queryKey: ["current-weather", latitude, longitude, temperature_unit],
    })
}

function NoDataWidget() {
    return (
        <Widget.TextWidget>
            <Widget.Title>Weather forecast</Widget.Title>
            <Widget.Text.Primary>No data</Widget.Text.Primary>
        </Widget.TextWidget>
    )
}

function WeatherWidget({id, object}: WeatherWidgetProps) {
    const {latitude, longitude, hasValidLocation, location} = useRecordLocation(object, id)
    const {data, isError} = useCurrentForecast(
        {
            latitude: latitude ?? 0,
            longitude: longitude ?? 0,
        },
        {enabled: hasValidLocation}
    )

    if (!hasValidLocation) {
        return <NoDataWidget />
    }

    if (isError) {
        void showToast({
            variant: "error",
            title: "Current forecast",
            text: "No information available to show on the widget",
        })
    }

    if (!data) {
        return <NoDataWidget />
    }

    return (
        <CurrentForecast
            temperature={data.current.temperature_2m}
            code={data.current.weather_code}
            location={location}
        />
    )
}

interface Props {
    code: number
    location: string | null
    temperature: number
}

function CurrentForecast({code, location, temperature}: Props) {
    const status = WmoCodesMap.get(code)

    return (
        <Widget.TextWidget>
            <Widget.Title>Weather forecast</Widget.Title>
            <Widget.Text.Primary>
                {status ? `${status.emoji} ${status.description}` : `No Data`}
            </Widget.Text.Primary>
            {location && <Widget.Text.Secondary>{location}</Widget.Text.Secondary>}
            <Widget.Decoration>
                <TemperatureBadge temperature={temperature} />
            </Widget.Decoration>
        </Widget.TextWidget>
    )
}

const weatherWidget: App.Record.Widget = {
    id: "current-weather-widget",
    label: "Current Forecast Widget",
    Widget: ({recordId, object}) => {
        return (
            <QueryProvider>
                <Suspense fallback={<Widget.Loading />}>
                    <WeatherWidget id={recordId} object={object} />
                </Suspense>
            </QueryProvider>
        )
    },
}

export default weatherWidget

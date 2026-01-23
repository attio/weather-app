import {Suspense} from "react"
import type {App} from "attio"
import {showToast, Widget} from "attio/client"
import {TemperatureBadge} from "../../components/temperature-badge"
import {useCurrentForecast} from "../../hooks/use-current-forecast"
import {useRecordLocation} from "../../hooks/use-record-location"
import {QueryProvider} from "../../utils/query-client"
import {WmoCodesMap} from "../../utils/wmo-codes"

interface WeatherWidgetProps {
    id: string
    object: string
}

function NoLocationWidget() {
    return (
        <Widget.TextWidget>
            <Widget.Title>Weather forecast</Widget.Title>
            <Widget.Text.Primary>No location</Widget.Text.Primary>
            <Widget.Text.Secondary>
                Add a location to this record to see the forecast
            </Widget.Text.Secondary>
        </Widget.TextWidget>
    )
}

function NoForecastWidget() {
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
        return <NoLocationWidget />
    }

    if (isError) {
        showToast({
            variant: "error",
            title: "Current forecast",
            text: "No information available to show on the widget",
        })
    }

    if (!data) {
        return <NoForecastWidget />
    }

    return (
        <CurrentForecast
            temperature={data.current.temperature_2m}
            code={data.current.weather_code}
            location={location ?? ""}
        />
    )
}

interface Props {
    code: number
    location: string
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
            <Widget.Text.Secondary>{location}</Widget.Text.Secondary>
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

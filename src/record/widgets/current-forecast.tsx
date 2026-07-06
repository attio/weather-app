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

function WeatherTextWidget({children}: {children: React.ReactNode}) {
    return (
        <Widget.TextWidget>
            <Widget.Title>Weather forecast</Widget.Title>
            {children}
        </Widget.TextWidget>
    )
}

function NoLocationWidget() {
    return (
        <WeatherTextWidget>
            <Widget.Text.Primary>No location</Widget.Text.Primary>
            <Widget.Text.Secondary>
                Add a location to this record to see the forecast
            </Widget.Text.Secondary>
        </WeatherTextWidget>
    )
}

function NoForecastWidget() {
    return (
        <WeatherTextWidget>
            <Widget.Text.Primary>No data</Widget.Text.Primary>
        </WeatherTextWidget>
    )
}

function WeatherWidget({id, object}: WeatherWidgetProps) {
    const recordLocation = useRecordLocation(object, id)
    const {data, isError} = useCurrentForecast(
        {
            latitude: recordLocation?.latitude ?? 0,
            longitude: recordLocation?.longitude ?? 0,
        },
        {enabled: recordLocation !== null}
    )

    if (!recordLocation) {
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
            location={recordLocation.location}
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
        <WeatherTextWidget>
            <Widget.Text.Primary>
                {status ? `${status.emoji} ${status.description}` : `No Data`}
            </Widget.Text.Primary>
            <Widget.Text.Secondary>{location}</Widget.Text.Secondary>
            <Widget.Decoration>
                <TemperatureBadge temperature={temperature} />
            </Widget.Decoration>
        </WeatherTextWidget>
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

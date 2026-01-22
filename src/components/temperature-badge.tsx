import {Badge, experimental_useWorkspaceSettings} from "attio/client"
import {getTemperatureBadgeColor} from "../utils/converter"
import { TemperatureUnit } from "../open-weather/schema"

interface TemperatureBadgeProps {
    temperature: number
}

/**
 * Displays a temperature badge with appropriate color coding based on the temperature value.
 * Automatically uses the workspace temperature temperature_unit setting (celsius or fahrenheit).
 */
export function TemperatureBadge({temperature}: TemperatureBadgeProps) {
    const {temperature_unit = "fahrenheit"} = experimental_useWorkspaceSettings()

    if (!temperature_unit) {
        return null
    }

    return (
        <Badge color={getTemperatureBadgeColor(temperature, (temperature_unit as TemperatureUnit))}>
            {`${temperature} °${temperature_unit[0].toUpperCase()}`}
        </Badge>
    )
}

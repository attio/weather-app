import {Badge, experimental_useWorkspaceSettings} from "attio/client"
import {getTemperatureBadgeColor, normalizeTemperatureScale} from "../utils/converter"

interface TemperatureBadgeProps {
    temperature: number
}

/**
 * Displays a temperature badge with appropriate color coding based on the temperature value.
 * Automatically uses the workspace temperature temperatureUnit setting (celsius or fahrenheit).
 */
export function TemperatureBadge({temperature}: TemperatureBadgeProps) {
    const {temperatureUnit} = experimental_useWorkspaceSettings()
    const scale = normalizeTemperatureScale(temperatureUnit)

    return (
        <Badge color={getTemperatureBadgeColor(temperature, scale)}>
            {`${temperature} °${scale[0].toUpperCase()}`}
        </Badge>
    )
}

import {Badge, experimental_useWorkspaceSettings} from "attio/client"
import {getTemperatureBadgeColor, normalizeTemperatureScale} from "../utils/converter"

interface TemperatureBadgeProps {
    temperature: number
}

/**
 * Displays a temperature badge with appropriate color coding based on the temperature value.
 * Automatically uses the workspace temperature scale setting (celsius or fahrenheit).
 */
export function TemperatureBadge({temperature}: TemperatureBadgeProps) {
    const {scale} = experimental_useWorkspaceSettings()
    const normalizedScale = normalizeTemperatureScale(scale)

    return (
        <Badge color={getTemperatureBadgeColor(temperature, normalizedScale)}>
            {`${temperature} °${normalizedScale[0].toUpperCase()}`}
        </Badge>
    )
}

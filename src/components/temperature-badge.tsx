import {Badge, useWorkspaceSettings} from "attio/client"
import type {TemperatureUnit} from "../open-weather/schema"

interface TemperatureBadgeProps {
    temperature: number
}

function getTemperatureBadgeColor(
    temperature: number,
    unit: TemperatureUnit
): React.ComponentProps<typeof Badge>["color"] {
    // Convert to Celsius if Fahrenheit
    const tempInCelsius = unit === "fahrenheit" ? ((temperature - 32) * 5) / 9 : temperature

    // Return color based on temperature ranges
    if (tempInCelsius <= -20) return "cyan"
    if (tempInCelsius <= -10) return "blue"
    if (tempInCelsius <= 0) return "grey"
    if (tempInCelsius <= 10) return "lime"
    if (tempInCelsius <= 20) return "green"
    if (tempInCelsius <= 25) return "yellow"
    if (tempInCelsius <= 30) return "amber"
    if (tempInCelsius <= 35) return "orange"
    return "red"
}

function formatTemperature(temperature: number, unit: TemperatureUnit): string {
    return `${temperature} °${unit[0].toUpperCase()}`
}

/**
 * Displays a temperature badge with appropriate color coding based on the temperature value.
 * Automatically uses the workspace temperature temperature_unit setting (celsius or fahrenheit).
 */
export function TemperatureBadge({temperature}: TemperatureBadgeProps) {
    const {temperature_unit = "fahrenheit"} = useWorkspaceSettings()

    return (
        <Badge color={getTemperatureBadgeColor(temperature, temperature_unit as TemperatureUnit)}>
            {formatTemperature(temperature, temperature_unit as TemperatureUnit)}
        </Badge>
    )
}

import type {Badge} from "attio/client"
import type React from "react"
import type {TemperatureUnit} from "../open-weather/schema"

/**
 * Normalizes temperature scale to ensure a valid value.
 * Defaults to "fahrenheit" if the scale is not "celsius".
 */
export function normalizeTemperatureScale(scale: string | null): TemperatureUnit {
    return scale === "celsius" ? "celsius" : "fahrenheit"
}

export function getTemperatureBadgeColor(
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

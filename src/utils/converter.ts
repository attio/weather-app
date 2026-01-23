import type React from "react"
import type {Badge} from "attio/client"
import type {TemperatureUnit} from "../open-weather/schema"

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

/**
 * Formats a temperature value with its unit symbol.
 * @param temperature - The temperature value
 * @param unit - The temperature unit (celsius or fahrenheit)
 * @returns Formatted string like "25 °C" or "77 °F"
 */
export function formatTemperature(temperature: number, unit: TemperatureUnit): string {
    return `${temperature} °${unit[0].toUpperCase()}`
}

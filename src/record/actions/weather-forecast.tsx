/**
 * Show Weather Forecast - Record Action
 *
 * This file defines a custom record action that displays a 7-day weather forecast
 * for people and company records in Attio. The action displays a dialog that:
 *
 * 1. **Queries location data** from Attio's GraphQL API using hooks
 * 2. **Fetches weather forecast** from Open-Meteo API via server function
 * 3. **Displays 7-day forecast** with temperature, precipitation, and wind speed
 *
 * @see https://docs.attio.com/sdk/entry-points/record-action - Record Actions documentation
 *
 * ### Dialogs
 * This action uses `showDialog()` to display a modal. The dialog:
 * - Shows a modal overlay with a title
 * - Receives a `hideDialog` callback to close programmatically
 * - Can be dismissed by clicking outside or pressing Esc
 * - Returns a Promise that resolves when closed
 *
 * @see https://docs.attio.com/sdk/dialogs/show-dialog - showDialog documentation
 */

import type {App} from "attio"
import {showDialog} from "attio/client"
import WeatherForecastDialog from "../../components/weather-forecast-dialog"

/**
 * Record action that shows 7-day weather forecast for people and companies.
 *
 * This action is registered in app.ts and appears as a button labeled "Show weather forecast"
 * with a "Cloud" icon on person and company record pages.
 *
 * When triggered, it opens a dialog that displays the 7-day weather forecast.
 */
export const showWeatherForecast: App.Record.Action = {
    /**
     * Unique identifier for this action.
     * Used internally by Attio to track and register the action.
     */
    id: "show-weather-forecast",

    /**
     * User-facing label displayed on the action button.
     * This text appears in the UI wherever the action is shown.
     */
    label: "Show weather forecast",

    /**
     * Icon displayed alongside the action label.
     * Uses Attio's built-in icon set.
     */
    icon: "Sun",

    /**
     * Function executed when the action is triggered.
     *
     * Opens a modal dialog showing the 7-day weather forecast.
     */
    onTrigger: async ({recordId, object}) => {
        // Display a modal dialog with the weather forecast
        await showDialog({
            title: "7-Day Weather Forecast",
            Dialog: () => {
                return <WeatherForecastDialog object={object} recordId={recordId} />
            },
        })
    },

    /**
     * Restricts this action to specific object types.
     * The action will only appear on person and company records.
     */
    objects: ["people", "companies"],
}

import {showDialog, Extensions} from "attio/client"
import WeatherForecastDialog from "../../../components/weather-forecast-dialog"

export default Extensions.defineExtension({
    type: "record-action",
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
})

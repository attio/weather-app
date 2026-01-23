import type {App} from "attio"

import weatherWidget from "./record/widgets/current-forecast"
import workspaceSettings from "./settings/workspace-settings"
import {showWeatherForecast} from "./record/actions/weather-forecast"
import "./app.settings"

export const app: App = {
    record: {
        /** @see https://docs.attio.com/sdk/entry-points/record-action  */
        actions: [showWeatherForecast],
        /** @see https://docs.attio.com/sdk/entry-points/bulk-record-action */
        bulkActions: [],
        /** @see https://docs.attio.com/sdk/entry-points/record-widget */
        widgets: [weatherWidget],
    },
    callRecording: {
        /** @see https://docs.attio.com/sdk/entry-points/call-recording-insight-text-selection-action */
        insight: {
            textActions: [],
        },
        /** @see https://docs.attio.com/sdk/entry-points/call-recording-summary-text-selection-action */
        summary: {
            textActions: [],
        },
        /** @see https://docs.attio.com/sdk/entry-points/call-recording-transcript-text-selection-action */
        transcript: {
            textActions: [],
        },
    },
     /** @see https://docs.attio.com/sdk/entry-points/workspace-settings */
    settings: {
        workspace: workspaceSettings,
    },
}

import {Settings, type SettingsSchema} from "attio"

export const settingsSchema = {
    workspace: {
        // Used to switch between Celsius and Fahrenheit temperature units
        temperatureUnit: Settings.string(),
    },
} satisfies SettingsSchema

export default settingsSchema

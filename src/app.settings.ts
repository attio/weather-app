import {Settings, type SettingsSchema} from "attio"

export const settingsSchema = {
    workspace: {
        /**
         * Used to switch between Celsius and Fahrenheit temperature units
         */
        temperature_unit: Settings.string(),
    },
} satisfies SettingsSchema

export default settingsSchema

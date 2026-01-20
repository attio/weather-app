import {Settings, type SettingsSchema} from "attio"

export const settingsSchema = {
    workspace: {
        scale: Settings.string(),
    },
} satisfies SettingsSchema

export default settingsSchema

import {Settings} from "attio"
export default Settings.defineWorkspaceSchema({
    /**
     * Used to switch between Celsius and Fahrenheit temperature units
     */
    temperature_unit: Settings.Schema.string(),
})

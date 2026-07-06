import type {App} from "attio"
import {useWorkspaceSettingsForm, type ComboboxOption} from "attio/client"

const temperatureUnitsOptions = [
    {label: "Celsius", value: "celsius"},
    {label: "Fahrenheit", value: "fahrenheit"},
] satisfies ComboboxOption[]

function Page() {
    const {Form, Section, Combobox} = useWorkspaceSettingsForm()

    return (
        <Form>
            <Section title="General">
                <Combobox
                    label="Select a temperature unit"
                    name="temperature_unit"
                    options={temperatureUnitsOptions}
                />
            </Section>
        </Form>
    )
}

const workspaceSettings: App.Settings.Workspace = {
    Page,
}

export default workspaceSettings

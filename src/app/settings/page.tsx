import {type ComboboxOption, Settings} from "attio/client"
import schema from "./schema"

const temperatureUnitsOptions = [
    {label: "Celsius", value: "celsius"},
    {label: "Fahrenheit", value: "fahrenheit"},
] satisfies ComboboxOption[]

export default Settings.defineWorkspacePage(schema, () => {
    const {Form, Section, Combobox} = Settings.useForm(schema)

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
})

import type {App} from "attio"
import {useWorkspaceSettingsForm} from "attio/client"

function Page() {
    const {
        Form,
        Section, Experimental_Fieldset: Fieldset,
        Experimental_RadioGroup: RadioGroup
    } = useWorkspaceSettingsForm()

    return (
        <Form>
            <Section title="General">
                <Fieldset legend="Temperature Scale">
                    <RadioGroup name="temperature_unit">
                        <RadioGroup.Item value="celsius" label="Celsius" />
                        <RadioGroup.Item value="fahrenheit" label="Fahrenheit" />
                    </RadioGroup>
                </Fieldset>
            </Section>
        </Form>
    )
}

const workspaceSettings: App.Settings.Workspace = {
    Page,
}

export default workspaceSettings

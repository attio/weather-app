import type {App} from "attio"
import {useWorkspaceSettingsForm} from "attio/client"

function Page() {
    const {Form, Section, Experimental_RadioGroup, Experimental_Fieldset} =
        useWorkspaceSettingsForm()

    return (
        <Form>
            <Section title="General">
                <Experimental_Fieldset legend="Temperature Scale">
                    <Experimental_RadioGroup name="temperature_unit">
                        <Experimental_RadioGroup.Item value="celsius" label="Celsius" />
                        <Experimental_RadioGroup.Item value="fahrenheit" label="Fahrenheit" />
                    </Experimental_RadioGroup>
                </Experimental_Fieldset>
            </Section>
        </Form>
    )
}

const workspaceSettings: App.Settings.Workspace = {
    Page,
}

export default workspaceSettings

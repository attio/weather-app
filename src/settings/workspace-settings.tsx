import type {App} from "attio"
import {experimental_useWorkspaceSettingsForm} from "attio/client"

function Page() {
    const {Form, Section, Experimental_RadioGroup, Experimental_Fieldset} =
        experimental_useWorkspaceSettingsForm()

    return (
        // eslint-disable-next-line attio/form-submit-button -- SubmitButton not available in experimental API
        <Form>
            <Section title="General">
                <Experimental_Fieldset legend="Temperature Scale">
                    {/* @ts-ignore - Experimental API: Schema type inference fails in CI when types aren't resolved, but "temperatureUnit" is valid per app.settings.ts */}
                    <Experimental_RadioGroup name="temperatureUnit">
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

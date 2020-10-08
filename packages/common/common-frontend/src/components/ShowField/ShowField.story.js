import ShowField from "./ShowField"
import i18n from "../../i18n"

const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12">
                    <story/>
                </v-col>
            </v-row>
        </v-container>`

export default {
    title: "Components|ShowField",
    decorators: [decorator]
};


const data = []

export const showField = () => ({
    components: {ShowField},
    props: {
        data: {default: data}
    },
    template: '<ShowField value="john" label="name" />',
    i18n
})

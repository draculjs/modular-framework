import ShowChipField from "./ShowChipField"
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
    title: "Components|ShowChipField",
    decorators: [decorator]
};


const data = []

export const ShowChipField = () => ({
    components: {ShowChipField},
    props: {
        data: {default: data}
    },
    template: '<ShowChipField chips="["john","buda"]" label="name" />',
    i18n
})

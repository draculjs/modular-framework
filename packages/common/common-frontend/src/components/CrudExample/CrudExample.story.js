import CrudExample from "./CrudExample"
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
    title: "Crud Example|Crud",
    decorators: [decorator]
};


export const normal = () => ({
    components: {CrudExample},
    template: '<CrudExample />',
    i18n
})

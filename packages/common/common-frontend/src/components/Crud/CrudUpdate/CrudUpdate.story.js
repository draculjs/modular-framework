import CrudUpdate from "./CrudUpdate"
import i18n from "../../../i18n"

const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12">
                    <story/>
                </v-col>
            </v-row>
        </v-container>`

export default {
    title: "Crud|CrudUpdate",
    decorators: [decorator]
};


export const crudUpdate = () => ({
    components: {CrudUpdate},
    template: '<CrudUpdate :open="true" >YOUR FORM</CrudUpdate>',
    i18n
})

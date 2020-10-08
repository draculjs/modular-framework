import CrudDelete from "./CrudDelete"
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
    title: "Crud|CrudDelete",
    decorators: [decorator]
};

export const crudDelete = () => ({
    components: {CrudDelete},
    template: '<CrudDelete :open="true" >Your text</CrudDelete>',
    i18n
})

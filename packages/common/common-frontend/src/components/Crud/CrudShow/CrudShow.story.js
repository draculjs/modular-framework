import CrudShow from "./CrudShow"
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
    title: "Crud|CrudShow",
    decorators: [decorator]
};


const item = {id: 1, name: 'john', lastname: 'doe'}

export const crudShow = () => ({
    components: {CrudShow},
    props: {
        item: {default: item}
    },
    template: '<CrudShow :open="true" :item="item" />',
    i18n
})

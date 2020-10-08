import CrudList from "./CrudList"
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
    title: "Crud|CrudList",
    decorators: [decorator]
};


const items = [{id: 1, name: 'john', lastname: 'doe'}, {id: 2, name: 'jane', lastname: 'doe'}]
const headers = [
    {text: i18n.t('common.name'), value: 'name'},
    {text: i18n.t('common.lastname'), value: 'lastname'},
]
export const crudList = () => ({
    components: {CrudList},
    props: {
        items: {default: items},
        headers: {default: headers},
    },
    template: '<CrudList :items="items" :headers="headers" :loading="false" :total-items="2" />',
    i18n
})

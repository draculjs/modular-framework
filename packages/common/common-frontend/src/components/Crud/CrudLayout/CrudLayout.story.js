import CrudLayout from "./CrudLayout"
import i18n from "../../../i18n"
import { withKnobs, text } from "@storybook/addon-knobs";

const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12">
                    <story/>
                </v-col>
            </v-row>
        </v-container>`

export default {
    title: "Crud|CrudLayout",
    decorators: [withKnobs, decorator]
};


const data = []

export const crudLayout = () => ({
    components: {CrudLayout},
    props: {
        title: {default: text('creating',"common.title")},
        subtitle: {default: text('updating',"common.subtitle")},
    },
    template: `<CrudLayout :title="title" 
                           :subtitle="subtitle">
        <template v-slot:list>
            <p>List...</p>
        </template>
        
    </CrudLayout>`,
    i18n
})

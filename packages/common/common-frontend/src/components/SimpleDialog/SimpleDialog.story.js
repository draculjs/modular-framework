import SimpleDialog from "./SimpleDialog"
import i18n from "../../i18n"
import {withKnobs, text, boolean} from "@storybook/addon-knobs";

const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12">
                    <story/>
                </v-col>
            </v-row>
        </v-container>`

export default {
    title: "Components|SimpleDialog",
    decorators: [withKnobs, decorator]
};


const data = []

export const simpleDialog = () => ({
    components: {SimpleDialog},
    props: {
        dialog: {default: boolean('dialog',true)},
        title: {default: text('title','The Title')},

    },
    template: '<simple-dialog v-model="dialog" :title="title" />',
    i18n
})

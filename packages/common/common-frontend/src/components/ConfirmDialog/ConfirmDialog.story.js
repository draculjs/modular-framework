import ConfirmDialog from "./ConfirmDialog"
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
    title: "Components|ConfirmDialog",
    decorators: [withKnobs, decorator]
};


const data = []

export const confirmDialog = () => ({
    components: {ConfirmDialog},
    props: {
        dialog: {default: boolean('dialog',true)},
        title: {default: text('title','The Title')},
        description: {default: text('description','The description')},

    },
    template: '<confirm-dialog v-model="dialog" :title="title" :description="description" />',
    i18n
})

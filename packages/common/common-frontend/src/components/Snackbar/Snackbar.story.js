import Snackbar from "./Snackbar"
import i18n from "../../i18n"
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
    title: "Components|Snackbar",
    decorators: [withKnobs, decorator]
};


const data = []

export const snackbar = () => ({
    components: {Snackbar},
    props: {
        msg: {default: text('message',null)}
    },
    template: '<Snackbar :message="msg" />',
    i18n
})

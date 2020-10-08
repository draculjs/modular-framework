import ToolbarDialog from "./ToolbarDialog"
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
    title: "Components|ToolbarDialog",
    decorators: [decorator]
};


const data = []

export const normal = () => ({
    components: {ToolbarDialog},
    template: '<ToolbarDialog />',
    i18n
})

export const danger = () => ({
    components: {ToolbarDialog},
    template: '<ToolbarDialog :danger="true" />',
    i18n
})

export const info = () => ({
    components: {ToolbarDialog},
    template: '<ToolbarDialog :info="true" />',
    i18n
})
import CloseButton from "./CloseButton"
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
    title: "Components|CloseButton",
    decorators: [decorator]
};


export const normal = () => ({
    components: {CloseButton},
    template: '<CloseButton />',
    i18n
})

import LearnSlot from "./LearnSlot"
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
    title: "Learn|LearnSlot",
    decorators: [decorator]
};


const data = []

export const normal = () => ({
    components: {LearnSlot},
    template: '<LearnSlot />',
    i18n
})

import Loading from "./Loading"
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
    title: "Components|Loading",
    decorators: [decorator]
};


const data = []

export const normal = () => ({
    components: {Loading},
    template: '<Loading />',
    i18n
})

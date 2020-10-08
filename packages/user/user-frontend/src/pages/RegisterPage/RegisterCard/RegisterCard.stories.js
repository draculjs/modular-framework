import RegisterCard from "./RegisterCard"
import i18n from "../../../i18n"
import router from "../../../router"
import store from "../../../store"

const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12" md="6" offset-md="3">
                    <story/>
                </v-col>
            </v-row>
        </v-container>`

export default {
    title: "PageComponents/Register",
    decorators: [decorator]
};


export const registerCard = () => ({
    components: {RegisterCard},
    template: ' <register-card>SLOT</register-card>',
    i18n, router, store
})

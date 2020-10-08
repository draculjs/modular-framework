import RegisterSuccessful from "./RegisterSuccessful"
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


const data = "someone@somehost.com"

export const registerSuccessful = () => ({
    components: {RegisterSuccessful},
    props: {
        data: {default: data}
    },
    template: '<register-successful :email="data"></register-successful>',
    i18n, router, store
})

import RegisterForm from "./RegisterForm"
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


const data = []

export const registerForm = () => ({
    components: {RegisterForm},
    props: {
        data: {default: data}
    },
    template: '<register-form :data="data"></register-form>',
    i18n, router, store
})

import LoginForm from "./LoginForm"
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
    title: "PageComponents/Login",
    decorators: [decorator]
};


export const loginForm = () => ({
    components: {LoginForm},
    template: ' <login-form></login-form>',
    i18n, router, store
})

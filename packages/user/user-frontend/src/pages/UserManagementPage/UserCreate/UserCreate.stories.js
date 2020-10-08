import UserCreate from "./UserCreate"
import i18n from "../../../i18n"
import router from "../../../router"
import store from "../../../store"

const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12" md="8" offset-md="2">
                    <story/>
                </v-col>
            </v-row>
        </v-container>`

export default {
    title: "PageComponents/UserManagement",
    decorators: [decorator]
};


const data = []

export const userCreate = () => ({
    components: {UserCreate},
    props: {
        data: {default: data}
    },
    template: '<UserCreate :data="data"/>',
    i18n, router, store
})

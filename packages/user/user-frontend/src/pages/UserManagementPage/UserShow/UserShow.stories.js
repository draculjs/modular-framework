import UserShow from "./UserShow"
import i18n from "../../../i18n"
import router from "../../../router"
import store from "../../../store"

const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12" md="10" offset-md="1">
                    <story/>
                </v-col>
            </v-row>
        </v-container>`

export default {
    title: "PageComponents/UserManagement",
    decorators: [decorator]
};


const data = {
    id: 2,
    username: "jane.doe",
    name: "Jane Doe",
    email: "jane.doe@gmail.com",
    role: {id: 2, name: "supervisor"},
    phone: "456",
    avatarurl: "",
    active: true,
    groups: []
}

export const userShow = () => ({
    components: {UserShow},
    props: {
        data: {default: data}
    },
    template: '<UserShow :item="data" />',
    i18n, router, store
})

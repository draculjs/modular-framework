import AdminChangeAvatar from "./AdminChangeAvatar"
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

export const adminChangeAvatar = () => ({
    components: {AdminChangeAvatar},
    props: {
        data: {default: data}
    },
    template: '<AdminChangeAvatar :user="data" />',
    i18n, router, store
})

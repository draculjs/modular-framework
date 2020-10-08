import UserList from "./UserList"
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
    totalItems: 2,
    loading: false,
    items: [
        {
            id: 1,
            username: "john.doe",
            name: "John Doe",
            email: "john.doe@gmail.com",
            role: {id: 1, name: "admin"},
            phone: "123",
            avatarurl: "",
            active: true,
            groups: []
        },
        {
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
    ]
}

export const userList = () => ({
    components: {UserList},
    props: {
        data: {default: data}
    },
    template: `<user-list :items="data.items" :loading="data.loading" :total-items="data.totalItems" />`,
    i18n, router, store
})

import RoleDelete from "./RoleDelete"
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
    title: "PageComponents/RoleManagement",
    decorators: [decorator]
};


const role = {
    id: 2,
    name: 'supervisor',
    permissions: ["SECURITY_USER_SHOW","SECURITY_USER_EDIT"]
}

export const roleDelete = () => ({
    components: {RoleDelete},
    props: {
        role: {default: role}
    },
    template: '<role-delete :role="role" />',
    i18n, router, store
})

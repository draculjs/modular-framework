import RoleUpdate from "./RoleUpdate"
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

const permissions = ["SECURITY_USER_SHOW","SECURITY_USER_CREATE", "SECURITY_USER_EDIT", "SECURITY_USER_DELETE"]

export const roleUpdate = () => ({
    components: {RoleUpdate},
    props: {
        role: {default: role},
        permissions: {default: permissions}
    },
    template: '<RoleUpdate :role="role" :permissions="permissions" />',
    i18n, router, store
})

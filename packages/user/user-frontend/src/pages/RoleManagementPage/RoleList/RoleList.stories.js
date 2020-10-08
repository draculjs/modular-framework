import RoleList from "./RoleList"
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


const roles =  [
    {
        id: 1,
        name: 'admin',
        permissions: ["SECURITY_USER_SHOW","SECURITY_USER_CREATE", "SECURITY_USER_EDIT", "SECURITY_USER_DELETE"]
    },
    {
        id: 2,
        name: 'supervisor',
        permissions: ["SECURITY_USER_SHOW","SECURITY_USER_EDIT"]
    },
    {
        id: 3,
        name: 'operator',
        permissions: ["SECURITY_USER_SHOW"]
    }
]

const permissions = [
    "SECURITY_USER_CREATE",
    "SECURITY_USER_EDIT",
    "SECURITY_USER_SHOW",
    "SECURITY_USER_DELETE"
]

export const roleList = () => ({
    components: {RoleList},
    props: {
        roles: {default: roles},
        permissions: {default: permissions},
    },
    template: '<role-list :roles="roles" :permissions="permissions" />',
    i18n, router, store
})

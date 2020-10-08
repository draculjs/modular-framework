import RoleCreate from "./RoleCreate"
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



const permissions = ["SECURITY_USER_SHOW","SECURITY_USER_CREATE", "SECURITY_USER_EDIT", "SECURITY_USER_DELETE"]


export const roleCreate = () => ({
    components: {RoleCreate},
    props: {
        permissions: {default: permissions}
    },
    template: '<RoleCreate :permissions="permissions" />',
    i18n, router, store
})

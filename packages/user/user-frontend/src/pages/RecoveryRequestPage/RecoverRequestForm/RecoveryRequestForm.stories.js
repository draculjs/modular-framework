import RecoveryRequestForm from "./RecoveryRequestForm"
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
    title: "PageComponents/Recovery",
    decorators: [decorator]
};


const data = []

export const startRecoveryForm = () => ({
    components: {RecoveryRequestForm},
    props: {
        data: {default: data}
    },
    template: '<RecoveryRequestForm :data="data" />',
    i18n, router, store
})

import ComponentTemplate from "./ComponentTemplate"
import i18n from "../../../i18n"
import router from "../../../router"
import store from "../../../store"

export default {
    title: "PageComponents/Template"
};


const data = ['apple','orange','pear']

export const componentTemplate = () => ({
    components: {ComponentTemplate},
    props: {
        data: {default: data}
    },
    template: '<v-container fluid><v-row><v-col cols="12" md="4"> <component-template :data="data"></component-template> </v-col></v-row></v-container>',
    i18n, router, store
})

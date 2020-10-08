import LoginFailCard from "./index";
import i18n from "../../../i18n";

const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12" md="4" offset-md="4">
                    <story/>
                </v-col>
            </v-row>
        </v-container>`

export default {
    title: "PageComponents/Dashboard",
    decorators: [decorator]
};


const data = [
    {
        username: "admin",
        attempts: 8,
    },
    {
        username: "jhon.doe",
        attempts: 3,
    },
]

export const loginFailCard = () => ({
    components: {LoginFailCard},
    props: {
        data: {default: data}
    },
    template: '<login-fail-card :data="data"></login-fail-card>',
    i18n
})

export const loginFailCardNoData = () => ({
    components: {LoginFailCard},
    props: {
        data: {default: []}
    },
    template: ' <login-fail-card :data="data" />',
    i18n
})
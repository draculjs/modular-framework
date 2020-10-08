import ProfileAvatar from "./ProfileAvatar"
import i18n from "../../../i18n"
import router from "../../../router"
import store from "../../../store"

import mockGqlClient from "../../../../gqlc-mock/gqlc-mock-data";
import profileProvider from "../../../providers/ProfileProvider"
profileProvider.setGqlc(mockGqlClient)

const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12" md="8" offset-md="2">
                    <story/>
                </v-col>
            </v-row>
        </v-container>`

export default {
    title: "PageComponents/Profile",
    decorators: [decorator]
};


const data = []

export const profileAvatar = () => ({
    components: {ProfileAvatar},
    props: {
        data: {default: data}
    },
    template: '<ProfileAvatar :data="data" />',
    i18n, router, store
})

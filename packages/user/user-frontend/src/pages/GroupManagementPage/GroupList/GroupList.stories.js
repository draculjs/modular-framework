import GroupList from "./GroupList"
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
    title: "PageComponents/GroupManagement",
    decorators: [decorator]
};


const data = [
    {
        id: 1,
        name: "Developers",
        color: "#00FF00",
        users: [
            {id: 1, username: "jhon.doe"},
            {id: 2, username: "jane.doe"}
        ]
    },
    {
        id: 2,
        name: "Networkers",
        color: "#00FF00",
        users: [
            {id: 1, username: "jhon.doe"}
        ]
    }
]

export const groupList = () => ({
    components: {GroupList},
    props: {
        data: {default: data}
    },
    template: '<group-list :items="data" :total-items="data.length" :loading="false" />',
    i18n, router, store
})

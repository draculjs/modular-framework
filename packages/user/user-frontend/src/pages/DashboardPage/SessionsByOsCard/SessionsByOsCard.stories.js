import SessionsByOsCard from "./SessionsByOsCard"
import i18n from "../../../i18n"


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
        osname: "Ubuntu",
        sum: 60, "__typename": "SessionsByOs"
    },
    {
        osname: "Mac",
        sum: 20,
        __typename: "SessionsByOs"
    },
    {
        osname: "Windows",
        sum: 80,
        __typename: "SessionsByOs"
    }
]

export const sessionsByOsCard = () => ({
    components: {SessionsByOsCard},
    props: {
        data: {default: data}
    },
    template: '<sessions-by-os-card :data="data" />',
    i18n
})

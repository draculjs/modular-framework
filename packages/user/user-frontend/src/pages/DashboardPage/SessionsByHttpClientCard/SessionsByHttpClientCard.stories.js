import SessionsByHttpClientCard from "./SessionsByHttpClientCard"
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
        clientname: "Firefox",
        sum: 40,
        __typename: "SessionsByClient"
    },
    {
        clientname: "Chrome",
        sum: 90,
        __typename: "SessionsByClient"
    },
    {
        clientname: "Safari",
        sum: 10,
        __typename: "SessionsByClient"
    }
]
export const sessionsByHttpClientCard = () => ({
    components: {SessionsByHttpClientCard},
    props: {
        data: {default: data}
    },
    template: ' <sessions-by-http-client-card :data="data" />',
    i18n
})

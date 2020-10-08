import SessionsByUserCard from "./SessionsByUserCard"
import i18n from "../../../i18n"


const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12" md="8" offset-md="2">
                    <story/>
                </v-col>
            </v-row>
        </v-container>`

export default {
    title: "PageComponents/Dashboard",
    decorators: [decorator]
};


const data =  [{
    durationAvg: 168.5,
    durationMin: 147,
    durationMax: 190,
    durationLast: 147,
    durationSum: 337,
    sessionCount: 2,
    requestSum: 18,
    requestAvg: 9,
    username: "jhon.doe",
    __typename: "SessionsByUser"
}, {
    durationAvg: 250,
    durationMin: 250,
    durationMax: 250,
    durationLast: 250,
    durationSum: 250,
    sessionCount: 1,
    requestSum: 13,
    requestAvg: 13,
    username: "jane.doe",
    __typename: "SessionsByUser"
}]

export const sessionsByUserCard = () => ({
    components: {SessionsByUserCard},
    props: {
        data: {default: data}
    },
    template: '<sessions-by-user-card :data="data" />',
    i18n
})

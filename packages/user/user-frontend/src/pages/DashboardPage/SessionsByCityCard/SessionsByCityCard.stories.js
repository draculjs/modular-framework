import SessionsByCityCard from "./SessionsByCityCard"
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
        city: "Buenos Aires",
        sum: 80,
        __typename: "SessionsByCity"
    },
    {
        city: "San Paulo",
        sum: 50,
        __typename: "SessionsByCity"
    },
    {
        city: "Montevideo",
        sum: 25,
        __typename: "SessionsByCity"
    }

]

export const sessionsByCityCard = () => ({
    components: {SessionsByCityCard},
    props: {
        data: {default: data}
    },
    template: ' <sessions-by-city-card :data="data"></sessions-by-city-card>',
    i18n
})

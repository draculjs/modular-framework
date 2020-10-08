import SessionsByCountryCard from "./SessionsByCountryCard"
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



const data = [
    {
        country: "AR",
        sum: 80,
        __typename: "SessionsByCountry"
    },
    {
        country: "BR",
        sum: 50,
        __typename: "SessionsByCountry"
    },
    {
        country: "UY",
        sum: 25,
        __typename: "SessionsByCountry"
    }
]

export const sessionsByCountryCard = () => ({
    components: {SessionsByCountryCard},
    props: {
        data: {default: data}
    },
    template: '<sessions-by-country-card :data="data"></sessions-by-country-card>',
    i18n
})

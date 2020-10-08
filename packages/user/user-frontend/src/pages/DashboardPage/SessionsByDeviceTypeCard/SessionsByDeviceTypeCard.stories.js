import SessionsByDeviceTypeCard from "./SessionsByDeviceTypeCard"
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
        devicetype: "desktop",
        sum: 80,
        __typename: "SessionsByDeviceType"
    },
    {
        devicetype: "tablet",
        sum: 10,
        __typename: "SessionsByDeviceType"
    }
]

export const sessionsByDeviceTypeCard = () => ({
    components: {SessionsByDeviceTypeCard},
    props: {
        data: {default: data}
    },
    template: '<sessions-by-device-type-card :data="data" />',
    i18n
})

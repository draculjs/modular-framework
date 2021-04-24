import GroupAutocomplete from "./GroupAutocomplete"
import i18n from "../../i18n"
import router from "../../router"
import store from "../../store"


const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12" md="6" offset-md="3">
                    <story/>
                </v-col>
            </v-row>
        </v-container>`

export default {
    title: "Components/GroupAutocomplete",
    decorators: [decorator]
};

export const groupAutocomplete= () => ({
    components: {GroupAutocomplete},
    data: () => ({ group: null }),
    template: ' <group-autocomplete v-model="group" clearable multiple chips></group-autocomplete>',
    i18n, router, store
})

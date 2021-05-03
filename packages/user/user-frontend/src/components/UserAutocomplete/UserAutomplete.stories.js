import UserAutocomplete from "./UserAutocomplete"
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
    title: "Components/UserAutocomplete",
    decorators: [decorator]
};

export const userAutocomplete= () => ({
    components: {UserAutocomplete},
    data: () => ({ user: null }),
    template: ' <user-autocomplete v-model="user" clearable ></user-autocomplete>',
    i18n, router, store
})

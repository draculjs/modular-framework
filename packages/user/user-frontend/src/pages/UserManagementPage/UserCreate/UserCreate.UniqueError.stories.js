import UserCreate from "./UserCreate"
import i18n from "../../../i18n"
import router from "../../../router"
import store from "../../../store"

//GraphQl Client Mock
import {createMockClient} from 'mock-apollo-client';
import UserProvider from "../../../providers/UserProvider";
import RoleProvider from "../../../providers/RoleProvider";
import GroupProvider from "../../../providers/GroupProvider";

import mockGqlClient from "../../../../gqlc-mock/gqlc-mock-data";
RoleProvider.setGqlc(mockGqlClient)
GroupProvider.setGqlc(mockGqlClient)
UserProvider.setGqlc(mockGqlClient)


const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12" md="8" offset-md="2">
                    <story/>
                </v-col>
            </v-row>
        </v-container>`

export default {
    title: "PageComponents/UserManagement",
    decorators: [decorator]
};


const data = []

export const userCreateUnique = () => ({
    components: {UserCreate},
    props: {
        data: {default: data}
    },
    template: '<UserCreate />',
    i18n, router, store
})

import UserAuditsCard from "./UserAuditsCard";
import i18n from "../../../i18n";

const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12" md="6" offset-md="3">
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
        date: "1590786734068",
        actionBy: {username: "jhon.doe", __typename: "User"},
        actionFor: {username: "jhon.doe", __typename: "User"},
        action: "passwordRecovery",
        __typename: "UserAudit"
    },
    {
        date: "1590518814473",
        actionBy: {username: "jhon.doe", __typename: "User"},
        actionFor: {username: "jhon.doe", __typename: "User"},
        action: "avatarChange",
        __typename: "UserAudit"
    },
    {
        date: "1590514840450",
        actionBy: {username: "jhon.doe", __typename: "User"},
        actionFor: {username: "jhon.doe", __typename: "User"},
        action: "userPasswordChange",
        __typename: "UserAudit"
    },
    {
        date: "1590514573730",
        actionBy: {username: "root", __typename: "User"},
        actionFor: {username: "jane.doe", __typename: "User"},
        action: "adminPasswordChange",
        __typename: "UserAudit"
    },
    {
        date: "1590508179781",
        actionBy: {username: "root", __typename: "User"},
        actionFor: {username: "jack.black", __typename: "User"},
        action: "userDeleted",
        __typename: "UserAudit"
    },
    {
        date: "1590161354432",
        actionBy: {username: "root", __typename: "User"},
        actionFor: {username: "jane.doe", __typename: "User"},
        action: "userModified",
        __typename: "UserAudit"
    },
    {
        date: "1590093222858",
        actionBy: {username: "root", __typename: "User"},
        actionFor: {username: "jack.black", __typename: "User"},
        action: "userCreated",
        __typename: "UserAudit"
    },
    {
        date: "1590093222908",
        actionBy: {username: "root", __typename: "User"},
        actionFor: {username: "jane.doe", __typename: "User"},
        action: "userCreated",
        __typename: "UserAudit"
    },
    {
        date: "1590093222808",
        actionBy: {username: "root", __typename: "User"},
        actionFor: {username: "jhon.doe", __typename: "User"},
        action: "userCreated",
        __typename: "UserAudit"
    },
    {
        date: "1590093222408",
        actionBy: null,
        actionFor: {username: "root", __typename: "User"},
        action: "userCreated",
        __typename: "UserAudit"
    }
]

export const userAuditsCard = () => ({
    components: {UserAuditsCard},
    props: {
        data: {default: data}
    },
    template: ' <user-audits-card :data="data"/>',
    i18n
})

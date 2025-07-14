<template>
    <v-container fluid>
        <v-row dense>
            <v-col cols="12" md="4">
                <admin-users-card/>
            </v-col>

            <v-col cols="12" md="4">
                <admin-groups-card/>
            </v-col>

            <v-col cols="12" md="4">
                <admin-roles-card/>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6" >
                <sessions-by-user-card :height="160" :data="sessionsByUser"/>
            </v-col>

            <v-col cols="12" md="3">
                <client-chart :data="sessionsByClient"></client-chart>
            </v-col>

            <v-col cols="12" md="3">
                <os-chart :data="sessionsByOs"></os-chart>
            </v-col>

            <v-col cols="12" md="3">
                <device-chart :data="sessionsByDeviceType"></device-chart>
            </v-col>


            <v-col cols="12" md="3" >
                <login-fail-card :data="loginFailByUsername"/>
            </v-col>



            <v-col cols="12" md="6">
                <country-map-chart :data="sessionsByCountry"></country-map-chart>
            </v-col>

            <v-col cols="12" md="6">
                <city-chart :data="sessionsByCity"></city-chart>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
    import SessionProvider from "../../providers/SessionProvider.js";

    import SessionsByUserCard from "./SessionsByUserCard/SessionsByUserCard.vue";
    import LoginFailCard from "./LoginFailCard";
    import AdminUsersCard from "./AdminUsersCard.vue";
    import AdminGroupsCard from "./AdminGroupsCard.vue";
    import AdminRolesCard from "./AdminRolesCard.vue";
    import DeviceChart from "./SessionsByDeviceTypeCard/SessionsByDeviceTypeCard.vue";
    import OsChart from "./SessionsByOsCard/SessionsByOsCard.vue";
    import ClientChart from "./SessionsByHttpClientCard/SessionsByHttpClientCard.vue";
    import CityChart from "./SessionsByCityCard/SessionsByCityCard.vue";

    export default {
        name: "DashboardAdmin",
        components: {
            CityChart,
            ClientChart,
            OsChart,
            DeviceChart,
            AdminRolesCard,
            AdminGroupsCard,
            AdminUsersCard,
            LoginFailCard,
            SessionsByUserCard
        },
        data() {
            return {
                sessionsByUser: [],
                sessionsByCountry: [],
                sessionsByDeviceType: [],
                sessionsByOs: [],
                sessionsByClient: [],
                sessionsByCity: [],
                loginFailByUsername: []
            }
        },
        created() {
            SessionProvider.dashboardData().then(r => {
                this.sessionsByUser = r.data.sessionsByUser
                this.sessionsByCountry = r.data.sessionsByCountry
                this.sessionsByOs = r.data.sessionsByOs
                this.sessionsByDeviceType = r.data.sessionsByDeviceType
                this.sessionsByClient = r.data.sessionsByClient
                this.sessionsByCity = r.data.sessionsByCity
                this.loginFailByUsername = r.data.loginFailByUsername
            })
        }
    }
</script>

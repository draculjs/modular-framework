<template>

    <v-container v-if="isAuth" fluid fill-height>
        <v-card class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 offset-sm-2 col-sm-8 col-xs-12 offset-xs-0 elevation-12" width="100%">

            <v-card-text class="text-center">
                <profile-avatar :me="me"/>
                <role-visualization-card/>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-text>
                <profile-details :me="me"/>
            </v-card-text>

            <v-card-text class="text-center pt-0 pb-3">
                <v-btn color="secondary" class="onSecondary--text"
                       @click="passwordDialog = true" v-t="'user.changeYourPassword'">
                </v-btn>
            </v-card-text>
        </v-card>

        <v-dialog v-if="passwordDialog" :value="passwordDialog" max-width="500" persistent>
            <profile-password @closeDialog="passwordDialog = false" />
        </v-dialog>

    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { RoleVisualizationCard } from '../../components/RoleVisualizationCard';
    import ProfileAvatar from "./ProfileAvatar";
    import ProfileDetails from "./ProfileDetails";
    import ProfilePassword from "./ProfilePassword";

    export default {
        name: "Profile",
        components: {ProfilePassword, ProfileDetails, ProfileAvatar, RoleVisualizationCard},
        data: () => {
            return {
                passwordDialog: false
            }
        },
        computed: {
            ...mapGetters(['isAuth', 'me']),
        },
    }
</script>

<style scoped>

</style>

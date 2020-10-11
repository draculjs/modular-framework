<template>

    <router-link to="/">

        <v-toolbar-title v-if="getLogo.mode === 'Round' ">
            <v-avatar :size="avatarSize" >
                <img v-if="getLogo.url"  :src="getLogo.url"/>
                <img v-else  src="@/assets/logo.png"/>
            </v-avatar>

        </v-toolbar-title>

        <v-toolbar-title v-if="getLogo.mode === 'Square' ">
            <v-avatar tile :size="avatarSize" >
                <img v-if="getLogo.url"  :src="getLogo.url"/>
                <img v-else  src="@/assets/logo.png"/>
            </v-avatar>
        </v-toolbar-title>

        <v-toolbar-title v-if="getLogo.mode === 'Rectangle' ">
            <v-img  v-if="getLogo.url" :height="avatarSize" max-width="150" contain :src="getLogo.url" />
            <v-img v-else :height="avatarSize" max-width="150" contain src="@/assets/logo.png" />
        </v-toolbar-title>



    </router-link>

</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "AppBarLogo",
        computed: {
            ...mapGetters(['getLogo'])
        },
        data(){
            return {
                avatarSize: 50
            }
        },
    }
</script>

<style scoped>

</style>

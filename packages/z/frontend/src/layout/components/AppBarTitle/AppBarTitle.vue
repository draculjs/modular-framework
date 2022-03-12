<template>

    <router-link to="/">
        <v-toolbar-title class="onPrimary--text ml-2">
            <b>{{getLogo.title}}</b>
        </v-toolbar-title>
    </router-link>

</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "AppBarTitle",
        computed: {
            ...mapGetters(['getLogo'])
        },
        data(){
            return {
                avatarSize: 40
            }
        },
    }
</script>

<style scoped>

</style>

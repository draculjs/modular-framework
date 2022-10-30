<template>

    <router-link to="/" class="text-decoration-none">
        <v-toolbar-title class="primary--text ml-2" >
            <b  >{{getLogo.title}}</b>
        </v-toolbar-title>
    </router-link>

</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "TitleToolbar",
        computed: {
            ...mapGetters(['getLogo'])
        }
    }
</script>

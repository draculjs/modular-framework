<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
                <user-crud></user-crud>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import UserCrud from './UserCrud'

    export default {
        name: "UsersAdmin",
        components: {
            UserCrud
        }
    }
</script>

<style scoped>

</style>
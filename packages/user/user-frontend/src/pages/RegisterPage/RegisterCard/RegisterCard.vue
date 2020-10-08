<template>
    <div>
        <v-card class="elevation-12">
            <v-toolbar color="primary" class="onPrimary--text">
                <v-toolbar-title v-t="'auth.createAccount'"></v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text>
               <slot></slot>
            </v-card-text>

        </v-card>

        <v-card class="elevation-12 mt-2">
            <v-card-text class="text-xs-center">
                <span v-t="'auth.alreadyAccount'"> </span>
                <router-link :to="{name: 'login'}" class="secondary--text font-weight-bold"
                             v-t="'auth.signIn'"
                />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    export default {
        name: "RegisterCard"
    }
</script>

<style scoped>

</style>
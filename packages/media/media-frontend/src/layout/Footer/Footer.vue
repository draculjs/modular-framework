<template>
    <v-footer dark padless>
        <v-card
                flat
                tile
                class="secondary white--text text-center"
                min-width="100%"
        >

            <v-card-text class="onSecondary--text py-2">
                APP NAME
            </v-card-text>

            <v-divider></v-divider>

            <v-card-text class="white--text blue-grey darken-4 pa-1">
                {{ new Date().getFullYear() }}  <strong>@CI</strong>
            </v-card-text>
        </v-card>
    </v-footer>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style scoped>

</style>

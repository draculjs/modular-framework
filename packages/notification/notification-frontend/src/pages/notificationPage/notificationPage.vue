<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
               <notification-show />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import notificationShow from "./notificationShow";

    export default {
        name: "notifications",
        components: {notificationShow}
    }

</script>

<style scoped>

</style>

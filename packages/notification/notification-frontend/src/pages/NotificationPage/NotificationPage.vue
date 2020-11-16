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
    import NotificationShow from "./NotificationShow";

    export default {
        components: {NotificationShow}
    }

</script>


<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
               <queue-crud />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import QueueCrud from "./QueueCrud";
    export default {
        name: "Queue",
        components: {QueueCrud}
    }
</script>

<style scoped>

</style>


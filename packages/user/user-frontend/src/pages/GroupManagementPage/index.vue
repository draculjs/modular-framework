<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
               <group-crud></group-crud>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import GroupCrud from "./GroupCrud";
    export default {
        name: "GroupPage",
        components: {GroupCrud}
    }
</script>

<style scoped>

</style>


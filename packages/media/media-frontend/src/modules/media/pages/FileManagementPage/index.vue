<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
               <file-crud />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import FileCrud from "./FileCrud";
    export default {
        name: "File",
        components: {FileCrud}
    }
</script>

<style scoped>

</style>


<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
               <audit-crud />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import AuditCrud from "./AuditCrud";
    export default {
        name: "Audit",
        components: {AuditCrud}
    }
</script>

<style scoped>

</style>


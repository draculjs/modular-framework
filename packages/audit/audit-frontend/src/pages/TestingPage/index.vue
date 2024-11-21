<template>
    <v-container fluid>
        <v-card class="mb-5">
            <v-card-title>
                {{ this.$t('audit.title') }}
            </v-card-title>

            <v-card-actions>
                <v-btn color="primary" @click="createNewAudit">Create audit</v-btn>
                <v-btn color="secondary" @click="updateAudit">Update audit</v-btn>
                <v-btn color="warning" @click="deleteAudit">Delete audit</v-btn>
            </v-card-actions>

        </v-card>
    </v-container>
</template>

<script>
import AuditProvider from "../../providers/AuditProvider";
export default {
    name: "AuditTest",
    methods: {
        createNewAudit() {
            AuditProvider.createAudit('CREATE', 'AUDIT', 'ksdf63ksdf923.123123')
        },
        updateAudit() {
            AuditProvider.createAudit('UPDATE', 'AUDIT', 'ksdf63ksdf923.123123', [
                { field: 'status', oldValue: 'inactive', newValue: 'active' }
            ])
        },
        deleteAudit() {
            AuditProvider.createAudit('DELETE', 'AUDIT', '123123')
        },

    }

}
</script>

<style>
.v-data-table-header th {
    white-space: nowrap !important;
    align-self: center
}
</style>
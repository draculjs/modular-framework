<template>
    <v-container fluid>
        <v-card class="mb-5">
            <v-card-title>
                {{ this.$t('audit.title') }}
            </v-card-title>

            <v-card-actions>
                <v-btn color="primary" @click="createNewAudit">Create audit</v-btn>
                <v-btn color="secondary" @click="updateAudit">Update audit</v-btn>
                <v-btn color="warning" @click="deleteAudit">mdi-delete audit</v-btn>
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
            AuditProvider.createAudit('CREATE', 'Servicio', 'kdsf8rg9c48v', [], {
                "id": "7a6irev0so3iuiobiw1fpf08z",
                "name": "nuevoservicioTesting",
                "stack": "testing",
                "image": {
                    "id": "",
                    "fullname": "sndregistry.sondeosglobal.com/docs/snd-docs:latest",
                    "domain": "sndregistry.sondeosglobal.com",
                    "namespace": "docs",
                    "name": "snd-docs",
                    "tag": "latest",
                    "nameWithTag": "snd-docs:latest"
                },
                "createdAt": "2024-12-09T14:38:53.389502821Z",
                "updatedAt": "2024-12-17T11:31:41.591560506Z",
                "labels": [
                    {
                        "name": "com.docker.stack.namespace",
                        "value": "testing"
                    }
                ],
                "envs": [
                    {
                        "name": "CONTROL_VERSION",
                        "value": "41873"
                    }
                ],
                "limits": {},
                "mode": "replic",
                "extraHosts": [],
                "dns": []
            }, 'FORTES')
        },
        updateAudit() {
            AuditProvider.createAudit('UPDATE', 'Servicio', 'kdsf8rg9c48v', [
                { field: 'name', oldValue: 'debops', newValue: 'devops' },
                { field: 'image', oldValue: 'sndregistry.sondeosglobal.com/docs/snd-docs', newValue: 'sndregistry.sondeosglobal.com/dockerway/docker-devops:2.13.0' },
                { field: 'stack', oldValue: 'docker', newValue: 'dockerway' }
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
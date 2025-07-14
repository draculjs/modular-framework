<template>
    <v-alert
            :value="true"
            color="success"
            icon="mdi-check-circle"
            outlined
    >
        <i18n path="auth.recoverySent" tag="p">
            <template v-slot:email>
                <strong>{{email}}</strong>
            </template>
        </i18n>
    </v-alert>
</template>

<script>
    export default {
        name: "RecoveryRequestFormSuccess",
        props: {
            email: String
        }
    }
</script>

<style scoped>

</style>
<template>
    <v-container fluid fill-height >
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <recover-request-form/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

    import RecoverRequestForm from '../RecoveryRequestPage/RecoverRequestForm'

    export default {
        name: "RecoveryRequestPage",
        components: {RecoverRequestForm},

    }
</script>


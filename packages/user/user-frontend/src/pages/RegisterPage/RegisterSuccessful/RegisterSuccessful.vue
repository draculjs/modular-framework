<template>

    <v-card class="elevation-12">
        <v-card-text>
            <v-alert
                    :value="true"
                    color="success"
                    icon="check_circle"
                    outlined
            >
                <i18n path="auth.activationSent" tag="p">
                    <template v-slot:email>
                        <strong>{{email}}</strong>
                    </template>
                </i18n>

            </v-alert>

        </v-card-text>

    </v-card>

</template>

<script>
    export default {
        name: "RegisterSuccessful",
        props: {
            email: String
        }
    }
</script>

<style scoped>

</style>

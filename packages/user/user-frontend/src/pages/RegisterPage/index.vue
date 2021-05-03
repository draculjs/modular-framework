<template>
    <v-container fluid fill-height >
        <v-container fluid fill-height class="grey lighten-3">
            <v-row align="center" justify="center">
                <v-col cols="12" sm="7" md="6" lg="6">

                    <register-successful v-if="!!email" :email="email"></register-successful>

                    <register-card v-else>
                        <register-form @userRegistered="userRegistered"></register-form>
                    </register-card>

                </v-col>
            </v-row>
        </v-container>
    </v-container>

</template>

<script>
    import RegisterForm from "./RegisterForm";
    import RegisterCard from "./RegisterCard";
    import RegisterSuccessful from "./RegisterSuccessful";

    export default {
        name: "Register",
        components: {RegisterCard, RegisterForm, RegisterSuccessful},
        data() {
            return {
                email: null
            }
        },
        methods: {
            userRegistered(email) {
                this.email = email
            }
        }
    }
</script>

<style scoped>

</style>

<template>
    <v-container fluid fill-height >
        <v-container fluid fill-height >
            <v-row align="center" justify="center">
                <v-col cols="12" sm="7" md="5" lg="4">
                    <login-card>
                        <login-form></login-form>
                    </login-card>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script>
    import LoginCard from "./LoginCard";
    import LoginForm from "./LoginForm";

    export default {
        name: "LoginPage",
        components: {LoginCard, LoginForm},
    }
</script>

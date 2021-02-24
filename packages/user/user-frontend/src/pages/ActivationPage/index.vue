<template>
    <v-container fluid fill-height >
        <v-container fluid fill-height class="grey lighten-3">
            <v-row align="center" justify="center">
                <v-col cols="12" sm="7" md="5" lg="4">
                    <activation></activation>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script>
    import Activation from "./Activation";

    export default {
        name: "ActivationPage",
        components: {
            Activation
        }
    }
</script>

<style scoped>

</style>

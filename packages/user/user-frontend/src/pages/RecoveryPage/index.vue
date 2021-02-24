<template>
    <v-container fluid fill-height >
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <recovery></recovery>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

    import Recovery from "./Recovery";

    export default {
        name: "RecoveryPage",
        components: {Recovery}

    }
</script>


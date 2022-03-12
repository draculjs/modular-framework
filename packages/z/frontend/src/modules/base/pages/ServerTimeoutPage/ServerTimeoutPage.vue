<template>
    <v-row>
        <loading v-if="loading"></loading>
        <v-divider></v-divider><br>
        <v-alert color="green">
            {{response}}
        </v-alert>
        <v-divider></v-divider><br>
        <v-alert color="red">
            {{error}}
        </v-alert>
        <v-divider></v-divider><br>
    </v-row>
</template>

<script>
    import baseProvider from "../../providers/BaseProvider";
    import {Loading} from "@dracul/common-frontend"

    export default {
        name: "ServerTimeoutPage",
        components: {Loading},
        data() {
            return {
                response: null,
                error: null,
                loading: false
            }
        },
        mounted() {
            this.loading = true
            baseProvider.pingTimeout()
                .then(response => {
                    this.response = JSON.stringify(response)
                })
                .catch(err => {
                    this.error = err.toString()
                })
                .finally(() => this.loading = false)
        }
    }
</script>

<style scoped>

</style>

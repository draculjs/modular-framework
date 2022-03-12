<template>
    <v-container fill-height>
        <v-row justify="center" align="center">
            <v-col cols="12" class="text-center">
                <span>Status: </span> <span>{{$store.state.base.serverStatus}}</span><br>
                <span>Time: </span> <span>{{$store.state.base.serverTime}} ms</span><br>
                <template v-if="$store.state.base.serverError">
                    <span>Error:</span> <span>{{$store.state.base.serverError}}</span><br>
                </template>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: 'ServerStatusPage',
        created() {
            this.$store.dispatch('ping')
        }
    }
</script>

<style scoped>

</style>

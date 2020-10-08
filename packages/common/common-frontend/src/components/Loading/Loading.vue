<template>
    <v-row
            class="fill-height"
            align-content="center"
            justify="center"
    >
        <v-col
                class="subtitle-1 text-center"
                cols="12"
        >
            {{ $t(text) }}
        </v-col>
        <v-col cols="6">
            <v-progress-linear
                    color="primary"
                    indeterminate
                    rounded
                    height="6"
            ></v-progress-linear>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: "Loading",
        props: {
            text: {type: String, default: "common.loading"},
        }
    }
</script>

<style scoped>

</style>
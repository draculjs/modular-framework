<template>
    <v-btn
            :color="color"
            text
            v-on="$listeners"

    >
        {{$t(text)}}
    </v-btn>
</template>

<script>
    export default {
        name: "CloseButton",
        props: {
            text: {type: String, default: "common.cancel"},
            loading: {type: Boolean, default: false},
            color: {type: String, default: 'secondary'}
        }
    }
</script>

<style scoped>

</style>
<template>
    <v-btn
            :name="name"
            :ref="name"
            :color="danger?'red':color"
            :class="danger?'white--text':'onSecondary--text'"
            v-on="$listeners"
            :loading="loading"
            :disabled="disabled"
    >
        {{$t(text)}}
    </v-btn>
</template>

<script>
    export default {
        name: "SubmitButton",
        props: {
            text: {type: String, default: "common.submit"},
            loading: {type: Boolean, default: false},
            disabled: {type: Boolean, default: false},
            danger: {type: Boolean, default: false},
            name: {type: String, default: 'submit'},
            color: {type: String, default: 'secondary'}
        }
    }
</script>

<style scoped>

</style>
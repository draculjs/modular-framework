<template>
    <v-btn
            :color="danger?'red':'secondary'"
            class="elevation-8"
            :class="danger?'white--text':'onSecondary--text--text'"
            v-on="$listeners"
            :loading="loading"
            :disabled="disabled"
            fab fixed bottom right
    >
        <v-icon>add</v-icon>
    </v-btn>
</template>

<script>
    export default {
        name: "AddButton",
        props: {
            loading: {type: Boolean, default: false},
            disabled: {type: Boolean, default: false},
            danger:{type: Boolean, default: false},
        }
    }
</script>

<style scoped>

</style>
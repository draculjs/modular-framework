<template>
    <v-btn
            :color="color"
            class="elevation-8"
            v-on="$listeners"
            :loading="loading"
            :disabled="disabled"
            fab fixed bottom right
    >
        <v-icon>mdi-plus</v-icon>
    </v-btn>
</template>

<script>
    export default {
        name: "AddButton",
        props: {
            loading: {type: Boolean, default: false},
            disabled: {type: Boolean, default: false},
            danger:{type: Boolean, default: false},
            color:{type: String, default: 'primary onPrimary--text'},
        }
    }
</script>

<style scoped>

</style>

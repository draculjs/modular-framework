<template>
    <v-alert v-if="!!errorMessage" type="error" dense text v-t="errorMessage"></v-alert>
</template>

<script>
    export default {
        name: "ErrorAlert",
        props: {
            errorMessage: {type:String, default: null}
        }
    }
</script>

<style scoped>

</style>
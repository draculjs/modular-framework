<template>
    <v-toolbar flat class="mb-2" :color="danger?'red':(info?'info':'primary')">
        <v-toolbar-title :class="danger?'white--text':'onPrimary--text'" v-t="title"></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn icon :class="danger?'white--text':'onPrimary--text'" @click="$emit('close')">
                <v-icon>close</v-icon>
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
    export default {
        name: "ToolbarDialog",
        props: {
            title: {type: String, default: "common.title"},
            danger: {type: Boolean, default: false},
            info: {type: Boolean, default: false}
        }
    }
</script>

<style scoped>

</style>
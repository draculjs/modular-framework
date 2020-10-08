<template>
    <div>
        <v-card class="elevation-6">
            <v-card-title class="title" v-t="title"></v-card-title>
            <v-card-subtitle class="" v-t="subtitle"></v-card-subtitle>
            <v-card-text>
                <slot name="list"></slot>
            </v-card-text>
        </v-card>

        <slot></slot>

    </div>
</template>

<script>
    export default {
        name: "CrudLayout",
        props: {
            title: String,
            subtitle: String,
        }
    }
</script>

<style scoped>

</style>
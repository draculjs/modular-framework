<template>
    <v-dialog v-model="value">
        <v-card>
            <toolbar-dialog
                    :title="title"
                    @close="$emit('close')"
            />


            <slot></slot>


        </v-card>
    </v-dialog>
</template>

<script>
    import ToolbarDialog from "../ToolbarDialog/ToolbarDialog";
    export default {
        name: "SimpleDialog",
        components: {ToolbarDialog},
        props: {
            value: {type: Boolean, default: false},
            title: {type: String, default: ''},

        }
    }
</script>

<style scoped>

</style>
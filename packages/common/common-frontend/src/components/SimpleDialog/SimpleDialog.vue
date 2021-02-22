<template>
    <v-dialog v-model="value">
        <v-card>
            <toolbar-dialog
                    :danger="danger"
                    :title="title"
                    @close="$emit('close')"
            />


          <v-card-text>
            <slot></slot>
          </v-card-text>


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
            danger: {type: Boolean, default: false},
        }
    }
</script>

<style scoped>

</style>

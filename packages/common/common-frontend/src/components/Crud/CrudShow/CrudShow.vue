<template>
    <v-dialog :value="open" max-width="850" persistent >
        <v-card>

            <toolbar-dialog
                    info
                    :title="title"
                    @close="$emit('close')"
            />

            <v-card-text>
                <slot></slot>
            </v-card-text>

            <v-divider />

            <v-card-actions>
                <v-spacer></v-spacer>
                <close-button @click="$emit('close')" ></close-button>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import ToolbarDialog from "../../ToolbarDialog";
    import CloseButton from "../../CloseButton/CloseButton";

    export default {
        name: "CrudShow",
        components: {CloseButton, ToolbarDialog},
        props: {
            title: {type: String, default: 'common.show'},
            open: {type: Boolean, default: false}
        }
    }
</script>

<style scoped>

</style>
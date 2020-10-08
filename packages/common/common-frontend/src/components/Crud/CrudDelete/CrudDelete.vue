<template>
    <v-dialog :value="open" max-width="850" persistent >
        <v-card>

            <toolbar-dialog
                    danger
                    :title="title"
                    @close="$emit('close')"
            />

            <v-card-text>
                <slot></slot>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <close-button color="grey darken-2" @click="$emit('close')"></close-button>
                <submit-button :loading="loading" danger @click="$emit('delete')" text="common.delete" ></submit-button>
            </v-card-actions>


        </v-card>
    </v-dialog>
</template>

<script>
    import ToolbarDialog from "../../ToolbarDialog";
    import CloseButton from "../../CloseButton/CloseButton";
    import SubmitButton from "../../SubmitButton/SubmitButton";

    export default {
        name: "CrudDelete",
        components: {SubmitButton, CloseButton, ToolbarDialog},
        props: {
            title: {type: String, default: 'common.delete'},
            open: {type: Boolean, default: false},
            loading: {type: Boolean, default: false}
        }
    }
</script>

<style scoped>

</style>
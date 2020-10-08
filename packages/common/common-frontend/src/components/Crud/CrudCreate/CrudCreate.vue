<template>
    <v-dialog :value="open" persistent fullscreen>
        <v-card>

            <toolbar-dialog
                    :title="title"
                    @close="$emit('close')"
            />

            <v-card-text v-if="!!errorMessage">
                <error-alert :errorMessage="errorMessage"></error-alert>
            </v-card-text>

            <v-card-text>
                <slot></slot>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <close-button @click="$emit('close')"></close-button>
                <submit-button :loading="loading" @click="$emit('create')"></submit-button>
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>

<script>
    import ToolbarDialog from "../../ToolbarDialog";
    import CloseButton from "../../CloseButton/CloseButton";
    import SubmitButton from "../../SubmitButton/SubmitButton";
    import ErrorAlert from "../../ErrorAlert/ErrorAlert";

    export default {
        name: "CrudCreate",
        components: {ErrorAlert, SubmitButton, CloseButton, ToolbarDialog},
        props: {
            title: {type: String, default: 'common.create'},
            open: {type: Boolean, default: false},
            loading: {type: Boolean, default: false},
            errorMessage: {type: String, default: null},
        }
    }
</script>

<style scoped>

</style>
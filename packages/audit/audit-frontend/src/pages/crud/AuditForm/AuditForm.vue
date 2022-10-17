<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="save">
        <v-row>

            <v-col cols="12" sm="6">
                <user-combobox v-model="form.user" :input-errors="inputErrors" />
            </v-col>


            <v-col cols="12" sm="6">
                <action-combobox v-model="form.action" :input-errors="inputErrors" />
            </v-col>


            <v-col cols="12" sm="6">
                <v-text-field 
                    color="secondary"
                    prepend-icon="track_changes" 
                    name="target" 
                    v-model="form.target"

                    :placeholder="$t('audit.labels.targetResource')"
                    :label="$t('audit.labels.targetResource')"
                    :error-messages="getInputErrors('target')"
                    :error="hasInputErrors('target')"
                    :rules="required"
                />
            </v-col>

            <v-col cols="12" sm="6">
                <v-text-field 
                    color="secondary"
                    prepend-icon="info" 
                    name="description" 
                    v-model="form.description"

                    :placeholder="$t('audit.labels.description')"
                    :label="$t('audit.labels.description')"
                    :error-messages="getInputErrors('description')"
                    :error="hasInputErrors('description')"
                />
            </v-col>

        </v-row>
    </v-form>
</template>

<script>

import { InputErrorsByProps, RequiredRule } from '@dracul/common-frontend'

import UserCombobox from "../../../components/UserCombobox";
import ActionCombobox from "../../../components/ActionCombobox";

export default {
    name: "AuditForm",
    mixins: [InputErrorsByProps, RequiredRule],
    components: {
        UserCombobox,
        ActionCombobox,
    },
    props: {
        value: {
            type: Object,
            required: true
        },
    },
    computed: {
        form: {
            get() { return this.value },
            set(val) { this.$emit('input', val) }
        }
    },
    watch: {
        form: {
            handler(newVal) {
                this.$emit('input', newVal)
            },
            deep: true
        }
    },
    methods: {
        validate() {
            return this.$refs.form.validate()
        }
    },
    data() {
        return {

        }
    }
}
</script>

<style scoped>

</style>


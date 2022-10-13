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
                <v-text-field prepend-icon="track_changes" name="target" v-model="form.target"
                    :label="$t('user.audit.labels.target')" :placeholder="$t('user.audit.labels.target')"
                    :error="hasInputErrors('target')" :error-messages="getInputErrors('target')" color="secondary"
                    :rules="required"></v-text-field>
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


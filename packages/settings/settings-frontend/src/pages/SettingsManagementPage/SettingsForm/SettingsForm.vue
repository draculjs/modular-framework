<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="save" >
        <v-row>

                    <v-col cols="12" sm="6">
                        <v-text-field

                                prepend-icon="fingerprint"
                                name="key"
                                v-model="form.key"
                                :label="$t('settings.settings.labels.key')"
                                :placeholder="$t('settings.settings.labels.key')"
                                :error="hasInputErrors('key')"
                                :error-messages="getInputErrors('key')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
                    </v-col>


                    <v-col cols="12" sm="6">
                        <v-text-field

                                prepend-icon="text_snippet"
                                name="value"
                                v-model="form.value"
                                :label="$t('settings.settings.labels.value')"
                                :placeholder="$t('settings.settings.labels.value')"
                                :error="hasInputErrors('value')"
                                :error-messages="getInputErrors('value')"
                                color="secondary"

                        ></v-text-field>
                    </v-col>


                   <v-col cols="12" sm="6">
                        <multi-lang-subform
                        field="label"
                        v-model="form.label"
                        :input-errors="inputErrors"
                        :label="$t('settings.settings.labels.label')"
                        :placeholder="$t('settings.settings.labels.label')"
                        />
                   </v-col>

        </v-row>
    </v-form>
</template>

<script>

    import {InputErrorsByProps, RequiredRule, MultiLangSubform } from '@dracul/common-frontend'

    export default {
        name: "SettingsForm",
        mixins: [InputErrorsByProps, RequiredRule    ],
        components: {MultiLangSubform},
        props:{
            value: {
                type: Object,
                required: true
            },
        },
        computed: {
           form: {
                get() { return this.value },
                set(val) {this.$emit('input', val)}
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
            validate(){
              return this.$refs.form.validate()
            }
        },
        data(){
            return {

            }
        }
    }
</script>

<style scoped>

</style>


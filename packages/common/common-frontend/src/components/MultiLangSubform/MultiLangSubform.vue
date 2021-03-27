<template>
    <v-form ref="form">
        <v-row>
            <v-col v-if="en" cols="12">
                <v-text-field
                        prepend-icon="language"
                        name="en"
                        v-model="form.en"
                        :label="label + ' - ' + $t('common.multiLang.en')"
                        :placeholder="placeholder + ' - ' + $t('common.multiLang.en')"
                        :error="hasInputErrors(field)"
                        :error-messages="getInputErrors(field)"
                        color="secondary"
                ></v-text-field>
            </v-col>

            <v-col v-if="es" cols="12">
                <v-text-field
                        prepend-icon="language"
                        name="es"
                        v-model="form.es"
                        :label="label + ' - ' + $t('common.multiLang.es')"
                        :placeholder="placeholder + ' - ' + $t('common.multiLang.es')"
                        :error="hasInputErrors(field)"
                        :error-messages="getInputErrors(field)"
                        color="secondary"
                ></v-text-field>
            </v-col>

            <v-col v-if="pt" cols="12">
                <v-text-field
                        prepend-icon="language"
                        name="pt"
                        v-model="form.pt"
                        :label="label + ' - ' + $t('common.multiLang.pt')"
                        :placeholder="placeholder + ' - ' + $t('common.multiLang.pt')"
                        :error="hasInputErrors(field)"
                        :error-messages="getInputErrors(field)"
                        color="secondary"
                ></v-text-field>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
    import InputErrorsByProps from '../../mixins/InputErrorsByProps'
    import RequiredRule from '../../mixins/RequiredRule'

    export default {
        name: "MultiLangSubform",
        mixins: [InputErrorsByProps, RequiredRule],
        props: {
            value: {
                type: Object,
                required: true
            },
            field: {type: String, required: true},
            en: {type: Boolean, default: true},
            es: {type: Boolean, default: true},
            pt: {type: Boolean, default: true},
            label: {type: String},
            placeholder: {type: String}

        },
        computed: {
            form: {
                get() {
                    return this.value
                },
                set(val) {
                    this.$emit('input', val)
                }
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
            },
        }
    }
</script>

<style scoped>

</style>

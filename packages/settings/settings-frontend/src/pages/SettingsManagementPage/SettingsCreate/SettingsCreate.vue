<template>
    <crud-create :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @create="create"
                 @close="$emit('close')"
    >
        <settings-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-create>
</template>

<script>

    import SettingsProvider from "../../../providers/SettingsProvider";

    import {CrudCreate, ClientError} from 'packages/common/common-frontend/src'

    import SettingsForm from "../SettingsForm";




    export default {
        name: "SettingsCreate",

        components: { SettingsForm, CrudCreate },

        props:{
          open: {type: Boolean, default: true}
        },

        data() {
            return {
                title: 'settings.settings.creating',
                errorMessage: '',
                inputErrors: {},
                loading: false,
                form: {
                    key: '',
                    value: '',
                    label: {en:null, es:null, pt:null}
                }
            }
        },

        methods: {
            create() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    SettingsProvider.createSettings(this.form).then(r => {
                            if (r) {
                                this.$emit('itemCreated',r.data.settingsCreate)
                                this.$emit('close')
                            }
                        }
                    ).catch(error => {
                         let clientError = new ClientError(error)
                         this.inputErrors = clientError.inputErrors
                         this.errorMessage = clientError.i18nMessage
                    }).finally(() => this.loading = false)
                }

            }

        },
    }
</script>

<style scoped>

</style>


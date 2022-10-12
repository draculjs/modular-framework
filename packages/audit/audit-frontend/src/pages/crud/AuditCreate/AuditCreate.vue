<template>
    <crud-create :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @create="create"
                 @close="$emit('close')"
    >
        <audit-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-create>
</template>

<script>

    import AuditProvider from "../../../../providers/AuditProvider";
    
    import {CrudCreate, ClientError} from '@dracul/common-frontend'
    
    import AuditForm from "../AuditForm";
    
    


    export default {
        name: "AuditCreate",
         
        components: { AuditForm, CrudCreate },
        
        props:{
          open: {type: Boolean, default: true}
        },
        
        data() {
            return {
                title: 'docker.audit.creating',
                errorMessage: '',
                inputErrors: {},
                loading: false,
                form: {
                    user: null,
                    action: '',
                    target: ''
                }
            }
        },
        
        methods: {
            create() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    AuditProvider.createAudit(this.form).then(r => {
                            if (r) {
                                this.$emit('itemCreated',r.data.createAudit)
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


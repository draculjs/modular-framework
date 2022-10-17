<template>
        <crud-update :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @update="update"
                 @close="$emit('close')"
    >
         <audit-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-update>
</template>

<script>

    import AuditProvider from "../../../../providers/AuditProvider";
    
    import {CrudUpdate, ClientError} from '@dracul/common-frontend'
    
    import AuditForm from "../AuditForm";
  
    

    export default {
        name: "AuditUpdate",
        
        components: { AuditForm, CrudUpdate },
        
        props:{
          open: {type: Boolean, default: true},
          item: {type: Object, required: true}
        },

        data() {
            return {
                title: 'audit.editing',
                errorMessage: '',
                inputErrors: {},
                loading: false,
                id: this.item.id,
                form: {
                    user: this.item.user ? this.item.user.id : null,
                    action: this.item.action,
                    target: this.item.target
                }
            }
        },
        methods: {
            update() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    AuditProvider.updateAudit(this.id, this.form).then(r => {
                            if (r) {
                                this.$emit('itemUpdated',r.data.updateAudit)
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


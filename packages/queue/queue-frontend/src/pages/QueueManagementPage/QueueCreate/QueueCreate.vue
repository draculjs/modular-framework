<template>
    <crud-create :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @create="create"
                 @close="$emit('close')"
    >
        <queue-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-create>
</template>

<script>

    import QueueProvider from "../../../providers/QueueProvider";
    
    import {CrudCreate, ClientError} from '@dracul/common-frontend'
    
    import QueueForm from "../QueueForm";
    
    


    export default {
        name: "QueueCreate",
         
        components: { QueueForm, CrudCreate },
        
        props:{
          open: {type: Boolean, default: true}
        },
        
        data() {
            return {
                title: 'queue.queue.creating',
                errorMessage: '',
                inputErrors: {},
                loading: false,
                form: {
                    blockedUntil: null,
                    workerId: '',
                    maxRetries: null,
                    retries: null,
                    progress: null,
                    progressDetail: '',
                    state: '',
                    topic: '',
                    payload: '',
                    done: false,
                    error: ''
                }
            }
        },
        
        methods: {
            create() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    QueueProvider.createQueue(this.form).then(r => {
                            if (r) {
                                this.$emit('itemCreated',r.data.queueCreate)
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


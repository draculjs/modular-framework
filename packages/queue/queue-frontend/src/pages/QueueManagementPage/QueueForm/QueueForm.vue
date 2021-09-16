<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="save" >
        <v-row>
           
                   <v-col cols="12" sm="6">
                     <v-row>
                       <v-col  sm="6">
                          <v-menu
                                v-model="blockedUntilDateMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                        
                                        :value="getDateFormat(form.blockedUntil)"
                                        :label="$t('queue.queue.labels.blockedUntil')"
                                        prepend-icon="event"
                                        readonly
                                        v-on="on"
                                        
                                        :error="hasInputErrors('blockedUntil')"
                                        :error-messages="getInputErrors('blockedUntil')"
                                        color="secondary"
                                ></v-text-field>
                            </template>
                            <v-date-picker :value="getDateFormat(form.blockedUntil)" @input="val => setDateToFormField('blockedUntil', val)">
                            </v-date-picker>
                          </v-menu>
                       </v-col>
                   
                       <v-col sm="6">
                       <v-menu
                                v-model="blockedUntilTimeMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                        :value="getTimeFormat(form.blockedUntil)"
                                        :label="$t('queue.queue.labels.blockedUntil')"
                                        prepend-icon="query_builder"
                                        readonly
                                        v-on="on"
                                        
                                        :error="hasInputErrors('blockedUntil')"
                                        :error-messages="getInputErrors('blockedUntil')"
                                        color="secondary"
                                ></v-text-field>
                            </template>
                            <v-time-picker :value="getTimeFormat(form.blockedUntil)" @input="val => setTimeToFormField('blockedUntil', val)">
                            </v-time-picker>
                          </v-menu>
                       </v-col>
                       
                     </v-row>

                   </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-text-field
                                
                                prepend-icon="badge"
                                name="workerId"
                                v-model="form.workerId"
                                :label="$t('queue.queue.labels.workerId')"
                                :placeholder="$t('queue.queue.labels.workerId')"
                                :error="hasInputErrors('workerId')"
                                :error-messages="getInputErrors('workerId')"
                                color="secondary"
                                
                        ></v-text-field>
                    </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-text-field
                                
                                prepend-icon="last_page"
                                name="maxRetries"
                                v-model.number="form.maxRetries"
                                type="number"
                                :label="$t('queue.queue.labels.maxRetries')"
                                :placeholder="$t('queue.queue.labels.maxRetries')"
                                :error="hasInputErrors('maxRetries')"
                                :error-messages="getInputErrors('maxRetries')"
                                color="secondary"
                                
                        ></v-text-field>
                    </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-text-field
                                
                                prepend-icon="double_arrow"
                                name="retries"
                                v-model.number="form.retries"
                                type="number"
                                :label="$t('queue.queue.labels.retries')"
                                :placeholder="$t('queue.queue.labels.retries')"
                                :error="hasInputErrors('retries')"
                                :error-messages="getInputErrors('retries')"
                                color="secondary"
                                
                        ></v-text-field>
                    </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-text-field
                                
                                prepend-icon="pending"
                                name="progress"
                                v-model.number="form.progress"
                                type="number"
                                :label="$t('queue.queue.labels.progress')"
                                :placeholder="$t('queue.queue.labels.progress')"
                                :error="hasInputErrors('progress')"
                                :error-messages="getInputErrors('progress')"
                                color="secondary"
                                
                        ></v-text-field>
                    </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-text-field
                                
                                prepend-icon="info"
                                name="progressDetail"
                                v-model="form.progressDetail"
                                :label="$t('queue.queue.labels.progressDetail')"
                                :placeholder="$t('queue.queue.labels.progressDetail')"
                                :error="hasInputErrors('progressDetail')"
                                :error-messages="getInputErrors('progressDetail')"
                                color="secondary"
                                
                        ></v-text-field>
                    </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-text-field
                                
                                prepend-icon="fact_check"
                                name="state"
                                v-model="form.state"
                                :label="$t('queue.queue.labels.state')"
                                :placeholder="$t('queue.queue.labels.state')"
                                :error="hasInputErrors('state')"
                                :error-messages="getInputErrors('state')"
                                color="secondary"
                                
                        ></v-text-field>
                    </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-text-field
                                
                                prepend-icon="topic"
                                name="topic"
                                v-model="form.topic"
                                :label="$t('queue.queue.labels.topic')"
                                :placeholder="$t('queue.queue.labels.topic')"
                                :error="hasInputErrors('topic')"
                                :error-messages="getInputErrors('topic')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
                    </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-text-field
                                
                                prepend-icon="note_add"
                                name="payload"
                                v-model="form.payload"
                                :label="$t('queue.queue.labels.payload')"
                                :placeholder="$t('queue.queue.labels.payload')"
                                :error="hasInputErrors('payload')"
                                :error-messages="getInputErrors('payload')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
                    </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-checkbox
                                prepend-icon="done"
                                name="done"
                                v-model="form.done"
                                :label="$t('queue.queue.labels.done')"
                                :error="hasInputErrors('done')"
                                :error-messages="getInputErrors('done')"
                                color="secondary"
                                :rules="required"
                        ></v-checkbox>
                    </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-text-field
                                
                                prepend-icon="error"
                                name="error"
                                v-model="form.error"
                                :label="$t('queue.queue.labels.error')"
                                :placeholder="$t('queue.queue.labels.error')"
                                :error="hasInputErrors('error')"
                                :error-messages="getInputErrors('error')"
                                color="secondary"
                                
                        ></v-text-field>
                    </v-col>
    
        </v-row>
    </v-form>
</template>

<script>

    import {InputErrorsByProps, RequiredRule } from '@dracul/common-frontend'
    
    
    
    import {DayjsMixin} from "@dracul/dayjs-frontend";

    

    export default {
        name: "QueueForm",
        mixins: [InputErrorsByProps, RequiredRule , DayjsMixin   ],
        
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
                blockedUntilDateMenu: false, blockedUntilTimeMenu: false
            }
        }
    }
</script>

<style scoped>

</style>


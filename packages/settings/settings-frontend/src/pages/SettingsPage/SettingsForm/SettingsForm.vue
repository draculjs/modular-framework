<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="save" >
        <v-row>



                    <v-col cols="12" sm="6">
                        <v-text-field
                                prepend-icon="text_snippet"
                                name="value"
                                v-model="form.value"
                                :label="form.label[getLanguage]"
                                :placeholder="form.label[getLanguage]"
                                color="secondary"
                        ></v-text-field>
                    </v-col>


        </v-row>
    </v-form>
</template>

<script>

    import {InputErrorsByProps, RequiredRule } from '@dracul/common-frontend'
    import {mapGetters} from "vuex";

    export default {
        name: "SettingsForm",
        mixins: [InputErrorsByProps, RequiredRule    ],
        props:{
            value: {
                type: Object,
                required: true
            },
        },
        computed: {
          ...mapGetters(['getLanguage']),
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


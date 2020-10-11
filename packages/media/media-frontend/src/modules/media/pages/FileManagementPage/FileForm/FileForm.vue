<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="save" >
        <v-row>
           
                    <v-col cols="12" sm="12">
                        <v-text-field
                                prepend-icon="description"
                                name="filename"
                                v-model="form.description"
                                :label="$t('media.file.description')"
                                :placeholder="$t('media.file.description')"
                                :error="hasInputErrors('description')"
                                :error-messages="getInputErrors('description')"
                                color="secondary"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12">
                        <v-combobox
                                prepend-icon="loyalty"
                                v-model="form.tags"
                                :label="$t('media.file.tags')"
                                multiple
                                chips
                                color="secondary"
                                item-color="secondary"
                        ></v-combobox>
                    </v-col>

        </v-row>
    </v-form>
</template>

<script>

    import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'


    export default {
        name: "FileForm",
        mixins: [InputErrorsByProps, RequiredRule],
        
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
        }
    }
</script>

<style scoped>

</style>


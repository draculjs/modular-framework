<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="save" >
        <v-row>
           
                    <v-col cols="12" sm="6">
                        <v-text-field
                                prepend-icon="description"
                                name="filename"
                                v-model="form.filename"
                                :label="$t('media.file.filename')"
                                :placeholder="$t('media.file.filename')"
                                :error="hasInputErrors('filename')"
                                :error-messages="getInputErrors('filename')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
                    </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-text-field
                                prepend-icon="extension"
                                name="extension"
                                v-model="form.extension"
                                :label="$t('media.file.extension')"
                                :placeholder="$t('media.file.extension')"
                                :error="hasInputErrors('extension')"
                                :error-messages="getInputErrors('extension')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
                    </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-text-field
                                prepend-icon="folder_open"
                                name="relativePath"
                                v-model="form.relativePath"
                                :label="$t('media.file.relativePath')"
                                :placeholder="$t('media.file.relativePath')"
                                :error="hasInputErrors('relativePath')"
                                :error-messages="getInputErrors('relativePath')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
                    </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-text-field
                                prepend-icon="folder"
                                name="absolutePath"
                                v-model="form.absolutePath"
                                :label="$t('media.file.absolutePath')"
                                :placeholder="$t('media.file.absolutePath')"
                                :error="hasInputErrors('absolutePath')"
                                :error-messages="getInputErrors('absolutePath')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
                    </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-text-field
                                prepend-icon="photo_size_select_actual"
                                name="size"
                                v-model="form.size"
                                :label="$t('media.file.size')"
                                :placeholder="$t('media.file.size')"
                                :error="hasInputErrors('size')"
                                :error-messages="getInputErrors('size')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
                    </v-col>
    
 
                    <v-col cols="12" sm="6">
                        <v-text-field
                                prepend-icon="link"
                                name="url"
                                v-model="form.url"
                                :label="$t('media.file.url')"
                                :placeholder="$t('media.file.url')"
                                :error="hasInputErrors('url')"
                                :error-messages="getInputErrors('url')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
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


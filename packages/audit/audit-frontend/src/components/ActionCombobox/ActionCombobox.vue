<template>

        <v-select
                
                
                prepend-icon="build"
                :items="items"
                v-model="item"
                :label="$t('docker.audit.labels.action')"
                :loading="loading"
                :error="hasInputErrors('action')"
                :error-messages="getInputErrors('action')"
                color="secondary"
                item-color="secondary"
                :rules="required"
                :clearable="clearable"
                :multiple="multiple"
                :chips="chips"
                :solo="solo"
        ></v-select>

</template>

<script>

    import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'
    
    

    export default {
        name: "ActionCombobox",
        mixins: [InputErrorsByProps, RequiredRule],
        props:{
            value: {type: [String, Array]},
            clearable: {type:Boolean, default: false},
            multiple: {type:Boolean, default: false},
            solo: {type:Boolean, default: false},
            chips: {type:Boolean, default: false}
        },
        data() {
            return {
                items: ['RESTART','UPDATE','REMOVE'],
                loading: false
            }
        },
        computed: {
           item: {
                get() { return this.value },
                set(val) {this.$emit('input', val)}
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


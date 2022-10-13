<template>
        <v-autocomplete
                prepend-icon="person"
                :items="items"
                :item-text="'username'"
                :item-value="'id'"
                v-model="item"
                :label="$t('user.audit.labels.user')"
                :loading="loading"
                :error="hasInputErrors('user')"
                :error-messages="getInputErrors('user')"
                color="secondary"
                item-color="secondary"
                :rules="isRequired ? required : []"
                :multiple="multiple"
                :chips="chips"
                :solo="solo"
                :disabled="disabled"
                :readonly="readonly"
                 :clearable="clearable"
        ></v-autocomplete>

</template>

<script>

    import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'
    
    
    import {userProvider} from "@dracul/user-frontend"

    export default {
        name: "UserCombobox",
        mixins: [InputErrorsByProps, RequiredRule],
        props:{
            value: {type: [String, Array]},
            multiple: {type:Boolean, default: false },
            solo: {type:Boolean, default: false},
            chips: {type:Boolean, default: false},
            readonly: {type:Boolean, default:false},
            disabled: {type:Boolean, default: false},
            isRequired: {type:Boolean, default: true },
             clearable: {type:Boolean, default: false},
        },
        data() {
            return {
                items: [],
                loading: false
            }
        },
        computed: {
           item: {
                get() { return this.value },
                set(val) {this.$emit('input', val)}
            }
        },
        mounted() {
         this.fetch()
        },
        methods: {
            validate(){
              return this.$refs.form.validate()
            },
            fetch(){
               this.loading= true
              userProvider.users().then(r => {
                    this.items = r.data.users
                }).catch(err => console.error(err))
                .finally(()=> this.loading = false)
            }
            
        }
    }
</script>

<style scoped>

</style>
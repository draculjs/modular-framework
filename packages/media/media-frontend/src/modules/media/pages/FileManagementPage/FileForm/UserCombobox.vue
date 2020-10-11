<template>
    <v-col cols="12" sm="6">
        <v-select
                prepend-icon="account_circle"
                :items="items"
                :item-text="'name'"
                :item-value="'id'"
                v-model="item"
                :label="$t('media.file.createdBy')"
                :loading="loading"
                :error="hasInputErrors('createdBy')"
                :error-messages="getInputErrors('createdBy')"
                color="secondary"
                item-color="secondary"
                
        ></v-select>
    </v-col>
</template>

<script>

    import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'
    
    import UserProvider from "../../../providers/UserProvider"
    

    export default {
        name: "CreatedByCombobox",
        mixins: [InputErrorsByProps, RequiredRule],
        props:{
            value: {
                type: String
            },
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
                UserProvider.fetchUsers().then(r => {
                    this.items = r.data.userFetch
                }).catch(err => console.error(err))
                .finally(()=> this.loading = false)
              
            }
            
        }
    }
</script>

<style scoped>

</style>


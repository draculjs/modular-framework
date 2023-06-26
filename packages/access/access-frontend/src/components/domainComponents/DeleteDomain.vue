<template>
    <v-dialog v-model="form.dialog" max-width="700" persistent>
        <v-card max-width="700">
            <v-card-title>¿Está seguro que desea eliminar el siguiente dominio?</v-card-title>
            <v-card-text>
                Ingrese el nombre del dominio <span style="user-select: none;" class="red--text">{{ form.value }}</span> a continuación para eliminarlo.
                <v-row>
                    <v-col cols="12">
                        <v-text-field label="Dominio" v-model="domain"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-btn block color="red" :disabled="domain != form.value" @click="deleteDomain">
                            <v-icon left>delete</v-icon>Eliminar
                        </v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-btn block color="blue" @click="form.dialog = false">
                            <v-icon left>cancel</v-icon>Cancelar
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import DomainsProvider from '../../providers/DomainsProvider'

    export default {
        name: 'DeleteDomainComponent',
        props: {
            value: {
                type: Object,
                required: true
            }
        },
        computed: {
            form: {
                get(){
                    return this.value
                },
                set(value){
                    this.$emit('input', value)
                }
            }
        },
        data(){
            return{
                domain: ''
            }
        },
        methods: {
            deleteDomain(){
                DomainsProvider.deleteDomain({
                    id: this.form.id
                })
                this.form.dialog = false
                this.$emit('deleted')
                this.domain = ''
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
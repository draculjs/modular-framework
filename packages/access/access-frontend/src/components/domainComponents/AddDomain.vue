<template>
    <v-dialog v-model="domain.dialog" max-width="700" persistent>
        <v-card max-width="700">
            <v-card-title>Añadir un nuevo dominio</v-card-title>
            <v-card-text>
                <v-form v-model="formValue">
                    <v-row>
                        <v-col md="8" sm="8" cols="12" align="start">
                            <v-text-field
                                label="dominio"
                                v-model="domain.value"
                                :rules="domainRules"
                            ></v-text-field>
                        </v-col>
                        <v-col md="4" sm="4" cols="12">
                            <v-checkbox
                                label="habilitar/deshabilitar"
                                v-model="domain.enable"
                            ></v-checkbox>  
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-btn block color="primary" :disabled="!formValue" @click="createDomain">
                                <v-icon left>add</v-icon>Añadir
                            </v-btn>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-btn block color="red" @click="domain.dialog = false">
                                <v-icon left>cancel</v-icon>Cancelar
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import DomainsProvider from '../../providers/DomainsProvider'

    export default {
        name: 'AddDomainComponent',
        props: {
            value: {
                type: Object,
                required: true,
                default: () => {
                    return {
                        value: '',
                        enable: false
                    }
                }
            },
        },
        data(){
            return {
                formValue: false,
                domainRules: [
                    value => !!value || 'Required',
                    value => {
                        if(/^(?:(?:https?|ftp):\/\/)?(?:www\.)?([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,})(?:\/[^\s]*)?$/.test(value)) return true
                        if(/^https?:\/\/([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)?)(?::\d+)?$/.test(value)) return true
                        return 'Debe ser un dominio valido'
                    }
                ]
            }
        },
        computed: {
            domain: {
                get(){
                    return this.value
                },
                set(value){
                    this.$emit('input', value)
                }
            },
        },
        methods: {
            async createDomain(){
                await DomainsProvider.createDomain({
                    value: this.domain.value,
                    enable: this.domain.enable
                })
                this.$emit('new-domain')
                this.domain.dialog = false
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
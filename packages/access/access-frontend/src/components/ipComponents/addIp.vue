<template>
    <v-dialog v-model="ip.dialog" max-width="700" persistent>
        <v-card max-width="700">
            <v-card-title>Añadir una nueva IP</v-card-title>
            <v-card-text>
                <v-form v-model="formValue">
                    <v-row>
                        <v-col md="8" sm="8" cols="12" align="start">
                            <v-text-field
                                label="ip"
                                v-model="ip.value"
                                :rules="ipRules"
                            ></v-text-field>
                        </v-col>
                        <v-col md="4" sm="4" cols="12">
                            <v-checkbox
                                label="habilitar/deshabilitar"
                                v-model="ip.enable"
                            ></v-checkbox>  
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-btn block color="primary" :disabled="!formValue" @click="createIp">
                                <v-icon left>mdi-plus</v-icon>Añadir
                            </v-btn>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-btn block color="red" @click="ip.dialog = false">
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
import IpProviders from '../../providers/IpProviders'

    export default {
        name: 'AddIpComponent',
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
                ipRules: [
                    value => !!value || 'Required',
                    value => {
                        if(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value)) return true
                        return 'Debe ser una ip válida'
                    }
                ]
            }
        },
        computed: {
            ip: {
                get(){
                    return this.value
                },
                set(value){
                    this.$emit('input', value)
                }
            },
        },
        methods: {
            async createIp(){
                await IpProviders.createIp({
                    value: this.ip.value,
                    enable: this.ip.enable
                })
                this.$emit('new-ip')
                this.ip.dialog = false
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
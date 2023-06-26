<template>
    <v-dialog v-model="form.dialog" max-width="700" persistent>
        <v-card max-width="700">
            <v-card-title>Editar ip</v-card-title>
            <v-card-text>
                <v-form v-model="formValue">
                    <v-row>
                        <v-col md="8" sm="8" cols="12" align="start">
                            <v-text-field
                                label="ip"
                                v-model="form.value"
                                :rules="ipRules"
                            ></v-text-field>
                        </v-col>
                        <v-col md="4" sm="4" cols="12">
                            <v-checkbox
                                label="habilitar/deshabilitar"
                                v-model="form.enable"
                            ></v-checkbox>  
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-btn block color="primary" :disabled="!formValue" @click="editIp">
                                <v-icon left>edit</v-icon>Editar
                            </v-btn>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-btn block color="red" @click="form.dialog = false">
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
        name: 'EditIpComponent',
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
        methods:{
            async editIp(){
                await IpProviders.updateIp({
                    id: this.form.id,
                    value: this.form.value,
                    enable: this.form.enable
                })
                this.form.dialog = false
                this.$emit('updated')
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
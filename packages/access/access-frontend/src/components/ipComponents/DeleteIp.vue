<template>
    <v-dialog v-model="form.dialog" max-width="700" persistent>
        <v-card max-width="700">
            <v-card-title>¿Está seguro que desea eliminar la siguiente Ip?</v-card-title>
            <v-card-text>
                Ingrese la ip <span style="user-select: none;" class="red--text">{{ form.value }}</span> a continuación para eliminarla.
                <v-row>
                    <v-col cols="12">
                        <v-text-field label="Dominio" v-model="ip"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-btn block color="red" :disabled="ip != form.value" @click="deleteIp">
                            <v-icon left>mdi-delete</v-icon>Eliminar
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
import IpProviders from '../../providers/IpProviders'

    export default {
        name: 'deleteIpComponent',
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
                ip: ''
            }
        },
        methods: {
            deleteIp(){
                IpProviders.deleteIp({
                    id: this.form.id
                })
                this.form.dialog = false
                this.$emit('deleted')
                this.ip = ''
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
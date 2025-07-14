<template>
    <v-card class="pa-2">
        <v-row align="center">
            <v-col cols="12" md="8" :align="$vuetify.breakpoint.mdAndUp ? 'start' : 'center'">
                <span class="text-h4">{{$t('access.ip.title')}}</span>
            </v-col>
            <v-col v-if="$vuetify.breakpoint.smAndDown" 
                cols="4" align="end">
                <v-btn fab color="primary" @click="addNewIp" class="floating-button">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <add-ip v-model="ip" @new-ip="haveNewIp"/>
        <ip-crud v-model="newIp" @addNewIp="addNewIp" @ip-updated="ipUpdatedAlert" @ip-deleted="ipDeletedAlert"/>
        <alert v-model="alert"/>
    </v-card>
</template>

<script>
import IpCrud from '../components/ipComponents/IpCrud.vue'
import AddIp from '../components/ipComponents/addIp.vue'
import Alert from '../components/commonComponents/Alert.vue'

export default {
    name: 'DomainsPage',
    components: {
        IpCrud,
        AddIp,
        Alert
    },
    data(){
        return{
            alert: {
                model: false,
                type: '',
                text: ''
            },
            newIp: false,
            ip: {
                dialog: false,
                value: '',
                enable: false
            }
        }
    },
    methods: {
        async addNewIp(){
            this.ip.dialog = true
            this.ip.value = ''
            this.ip.enable = false
        },
        haveNewIp(){
            this.newIp = !this.newIp
            this.alert = {
                model: true,
                type: 'success',
                text: 'Se ha añadido un nuevo dominio con exito.'
            }
        },
        ipUpdatedAlert(){
            this.alert = {
                model: true,
                type: 'success',
                text: 'Se ha actualizado el dominio correctamente.'
            }
        },
        ipDeletedAlert(){
            this.alert = {
                model: true,
                type: 'success',
                text: 'Se ha eliminado el dominio correctamente.'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .floating-button{
        position: fixed;
        bottom: 80px;
        right: 20px;
        z-index: 1;
    }
</style>
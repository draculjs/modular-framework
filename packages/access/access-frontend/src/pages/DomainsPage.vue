<template>
    <v-card class="pa-2">
        <v-row align="center">
            <v-col cols="12" md="8" :align="$vuetify.breakpoint.mdAndUp ? 'start' : 'center'">
                <span class="text-h4">{{$t('access.domain.title')}}</span>
            </v-col>
            <v-col v-if="$vuetify.breakpoint.smAndDown" 
                cols="4" align="end">
                <v-btn fab color="primary" @click="addNewDomain" class="floating-button">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <add-domain v-model="domain" @new-domain="haveNewDomain"/>
        <domain-crud v-model="newDomain" @addNewDomain="addNewDomain" @domain-updated="domainUpdatedAlert" @domain-deleted="domainDeletedAlert"/>
        <alert v-model="alert"/>
    </v-card>
</template>

<script>
import DomainCrud from '../components/domainComponents/DomainCrud.vue'
import AddDomain from '../components/domainComponents/AddDomain.vue'
import Alert from '../components/commonComponents/Alert.vue'

export default {
    name: 'DomainsPage',
    components: {
        DomainCrud,
        AddDomain,
        Alert
    },
    data(){
        return{
            alert: {
                model: false,
                type: '',
                text: ''
            },
            newDomain: false,
            domain: {
                dialog: false,
                value: '',
                enable: false
            }
        }
    },
    methods: {
        async addNewDomain(){
            this.domain.dialog = true
            this.domain.value = ''
            this.domain.enable = false
        },
        haveNewDomain(){
            this.newDomain = !this.newDomain
            this.alert = {
                model: true,
                type: 'success',
                text: 'Se ha añadido un nuevo dominio con exito.'
            }
        },
        domainUpdatedAlert(){
            this.alert = {
                model: true,
                type: 'success',
                text: 'Se ha actualizado el dominio correctamente.'
            }
        },
        domainDeletedAlert(){
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
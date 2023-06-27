<template>
    <v-row align="center">
        <v-col cols="12" md="3" v-if="$vuetify.breakpoint.mdAndUp">
            <v-btn color="primary" block @click="$emit('addNewIp')">
                <v-icon left>add</v-icon>Añadir Ip
            </v-btn>
        </v-col>
        <v-col cols="12" :offset-md="$vuetify.breakpoint.mdAndUp ? 6 : 9" md="3">
            <v-text-field 
                clearable
                prepend-inner-icon="search" 
                label="Buscar" 
                v-model="search"
                @input="fetch"
                ></v-text-field>
        </v-col>
        <v-col cols=""></v-col>
        <v-col cols="12">
            <v-data-table
                  class="mt-3"
                  :headers="headers"
                  :items="items"
                  :search="search"
                  :single-expand="false"
                  :server-items-length="totalItems"
                  :loading="loading"
                  :page.sync="pageNumber"
                  :items-per-page.sync="itemsPerPage"
                  :sort-by.sync="orderBy"
                  :sort-desc.sync="orderDesc"
                  :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50] }"
                  @update:page="fetch"
                  @update:items-per-page="fetch"
                  @update:sort-by="fetch"
                  @update:sort-desc="fetch"
              >
                <template v-slot:item.enable="{ item }">
                    <v-row justify="center">
                        <v-checkbox
                            :label="item.enable ? $t('access.ip.crud.enable.enable') : $t('access.ip.crud.enable.disable')"
                            v-model="item.enable"
                            @change="updateEnable(item)"
                        ></v-checkbox>
                    </v-row>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-row justify="center">
                        <v-btn color="blue" @click="editIp(item)" class="mx-2">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn color="red" @click="deleteIp(item)" class="mx-2">
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </v-row>
                </template>
            </v-data-table>
        </v-col>
        <edit-ip v-model="ipEditing" @updated="ipUpdated"/>
        <delete-ip v-model="ipDeleting" @deleted="ipDeleted"/>
    </v-row>
</template>

<script>
import DeleteIp from './DeleteIp.vue'
import EditIp from './EditIp.vue';
import IpProviders from '../../providers/IpProviders';

    export default {
        name: 'IpCrudComponent',
        components: {
            EditIp,
            DeleteIp
        },
        props: {
            value: {
                type: Boolean,
                required: true
            }
        },
        watch:{
            value(){
                this.fetch()
            }
        },
        data(){
            return {
                ipDeleting: {},
                ipEditing: {},
                orderBy: '',
                orderDesc: false,
                totalItems: 0,
                itemsPerPage: 5,
                pageNumber: 1,
                loading: false,
                search: '',
                headers: [
                    {
                        text: this.$t('access.ip.crud.value'),
                        value: 'value',
                        align: 'center'
                    },
                    {
                        text: this.$t('access.ip.crud.enable.title'),
                        value: 'enable',
                        align: 'center'
                    },
                    {
                        text: this.$t('access.ip.crud.actions'),
                        value: 'actions',
                        align: 'center'
                    }
                ],
                items: []
            }
        },
        mounted(){
            this.fetch()
        },
        methods:{
            async fetch(){
                const {data: {paginateIp: {items, page, totalItems}}} = await IpProviders.paginateIp({
                    pageNumber: this.pageNumber,
                    itemsPerPage: this.itemsPerPage,
                    search: this.search,
                    orderBy: this.orderBy,
                    orderDesc: this.orderDesc
                })
                this.items = items
                this.pageNumber = page
                this.totalItems = totalItems
            },
            async editIp({id, value, enable}){
                this.ipEditing = {
                    id,
                    value,
                    enable,
                    dialog: true
                }
            },
            async deleteIp({id, value, enable}){
                this.ipDeleting = {
                    id,
                    value,
                    enable,
                    dialog: true
                }
            },
            async updateEnable({id, value, enable}){
                IpProviders.updateIp({id, value, enable})
                this.$emit('ip-updated')
            },
            ipUpdated(){
                this.fetch()
                this.$emit('ip-updated')
            },
            ipDeleted(){
                this.fetch()
                this.$emit('ip-deleted')
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
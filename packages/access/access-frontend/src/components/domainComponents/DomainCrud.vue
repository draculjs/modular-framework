<template>
    <v-row align="center">
        <v-col cols="12" md="3" v-if="$vuetify.breakpoint.mdAndUp">
            <v-btn color="primary" block @click="$emit('addNewDomain')">
                <v-icon left>mdi-plus</v-icon>Añadir dominio
            </v-btn>
        </v-col>
        <v-col cols="12" :offset-md="$vuetify.breakpoint.mdAndUp ? 6 : 9" md="3">
            <v-text-field 
                clearable
                prepend-inner-icon="mdi-magnify" 
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
                            :label="item.enable ? $t('access.domain.crud.enable.enable') : $t('access.domain.crud.enable.disable')"
                            v-model="item.enable"
                            @change="updateEnable(item)"
                        ></v-checkbox>
                    </v-row>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-row justify="center">
                        <v-btn color="blue" @click="editDomain(item)" class="mx-2">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn color="red" @click="deleteDomain(item)" class="mx-2">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-row>
                </template>
            </v-data-table>
        </v-col>
        <edit-domain v-model="domainEditing" @updated="domainUpdated"/>
        <delete-domain v-model="domainDeleting" @deleted="domainDeleted"/>
    </v-row>
</template>

<script>
import DeleteDomain from './DeleteDomain.vue'
import EditDomain from './EditDomain.vue';
import DomainsProvider from '../../providers/DomainsProvider';

    export default {
        name: 'DomainCrudComponent',
        components: {
            EditDomain,
            DeleteDomain
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
                domainDeleting: {},
                domainEditing: {},
                orderBy: '',
                orderDesc: false,
                totalItems: 0,
                itemsPerPage: 5,
                pageNumber: 1,
                loading: false,
                search: '',
                headers: [
                    {
                        text: this.$t('access.domain.crud.value'),
                        value: 'value',
                        align: 'center'
                    },
                    {
                        text: this.$t('access.domain.crud.enable.title'),
                        value: 'enable',
                        align: 'center'
                    },
                    {
                        text: this.$t('access.domain.crud.actions'),
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
                const {data: {paginateDomain: {items, page, totalItems}}} = await DomainsProvider.paginateDomain({
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
            async editDomain({id, value, enable}){
                this.domainEditing = {
                    id,
                    value,
                    enable,
                    dialog: true
                }
            },
            async deleteDomain({id, value, enable}){
                this.domainDeleting = {
                    id,
                    value,
                    enable,
                    dialog: true
                }
            },
            async updateEnable({id, value, enable}){
                DomainsProvider.updateDomain({id, value, enable})
                this.$emit('domain-updated')
            },
            domainUpdated(){
                this.fetch()
                this.$emit('domain-updated')
            },
            domainDeleted(){
                this.fetch()
                this.$emit('domain-deleted')
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
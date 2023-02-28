<template>
    <v-card class="fill-height">
        <v-card-title>
            {{ this.$t('audit.title') }}
        </v-card-title>

        <v-card-subtitle>
            {{ this.$t('audit.subtitle') }}
        </v-card-subtitle>

            <v-row align-content="space-between" justify="space-between" style="height: 90%;">
    
                <v-col cols="12" >
                            <audit-filters
                                @updateFilters="setFilters"
                                @clearFilter="cleanFilters"
                                v-model="filters"
                            >
                            </audit-filters>

                </v-col>

            
                    <v-col cols="12" fill-height>
            
                        <v-data-table
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
                                @update:sort-by="fetch"
                                @update:sort-desc="fetch"
                                @update:items-per-page="fetch"
                        >
                
                
                            <template v-slot:item.user="{ item }">
                            {{ item.user ? item.user.username : '' }}
                            </template>
                
                            <template v-slot:item.createdAt="{ item }">
                            {{ getDateTimeFormat(item.createdAt) }}
                            </template>
                
                
                            <template slot="no-data" fill-height>
                                <div class="text-xs-center" v-t="'common.noData'"></div>
                            </template>
                
                            <template slot="loading" fill-height>
                                <div   class="text-xs-center" v-t="'common.loading'"></div>
                            </template>
                
                
                        </v-data-table>
                    </v-col>
            </v-row>
        </v-card>
</template>
   
<script>
    import AuditProvider from "../../providers/AuditProvider";
    import AuditFilters from "./AuditFilters.vue";

    // import { SearchInput} from "@dracul/common-frontend"
    import { DayjsMixin} from "@dracul/dayjs-frontend"
   
   
       export default {
           name: "AuditList",
        //    SearchInput, 
           components: {AuditFilters}, 
           mixins: [DayjsMixin],
           data() {
               return {
                    items: [],
                    totalItems: null,
                    loading: false,
                    orderBy: null,
                    orderDesc: false,
                    itemsPerPage: 5,
                    pageNumber: 1,
                    search: '',
                    filters: [
                                {
                                field: 'action',
                                operator: '$regex',
                                value: null
                                },
                                {
                                field: 'user',
                                operator: '$eq',
                                value: null
                                },
                                {
                                field: 'resource',
                                operator: '$regex',
                                value: null
                                }
                            ]
               }
           },
           computed: {
             headers () {
               return [
                       //Entity Headers
                       {text: this.$t('audit.labels.createdAt'), value: 'createdAt'},
                       {text: this.$t('audit.labels.user'), value: 'user'},
                       {text: this.$t('audit.labels.action'), value: 'action'},
                       {text: this.$t('audit.labels.targetResource'), value: 'resource'},
                       {text: this.$t('audit.labels.description'), value: 'description'},
                       //Actions
                   ]
             },
             getOrderBy(){
                 return  (Array.isArray(this.orderBy)) ? this.orderBy[0]: this.orderBy
             },
             getOrderDesc(){
                 return  (Array.isArray(this.orderDesc)) ? this.orderDesc[0]: this.orderDesc
             }
           },
           created() {
               this.fetch()
           },
           methods:{
               performSearch(){
                   this.pageNumber = 1
                   this.fetch()
               },
               fetch() {
                   this.loading = true
                   AuditProvider.paginateAudit(
                       this.pageNumber,
                       this.itemsPerPage,
                       this.search,
                       this.filters,
                       this.getOrderBy,
                       this.getOrderDesc
                   ).then(r => {
                    console.log('paginate audit', r)
                       this.items = r.data.paginateAudit.items
                       this.totalItems = r.data.paginateAudit.totalItems
                   }).catch(err => {
                       console.error(err)
                   }).finally(() => this.loading = false)
               },
               setFilters(auditFilters) {
                console.log('auditFilters', auditFilters)
                    this.filters = auditFilters
                    this.fetch()
                },
                cleanFilters() {
                    this.filters.forEach(filter => {
                        filter.value = null
                    })
                    this.fetch()
                }
           }
   
       }
   </script>
   
   
   
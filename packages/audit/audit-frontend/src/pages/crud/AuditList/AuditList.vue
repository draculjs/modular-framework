<template>
 <v-row row wrap>

    <v-col cols="12" >
        <v-row justify="space-between">
            <v-col cols="12" sm="6" md="8">
             <!-- FILTERS HERE -->
            </v-col>
            <v-col cols="12" sm="6" md="4">
            <search-input  @search="performSearch" v-model="search" />
            </v-col>
        </v-row>
    </v-col>

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


            <template slot="no-data">
               <div class="text-xs-center" v-t="'common.noData'"></div>
            </template>

            <template slot="loading">
               <div   class="text-xs-center" v-t="'common.loading'"></div>
            </template>


        </v-data-table>
    </v-col>
</v-row>
</template>

<script>
   import AuditProvider from "../../../../providers/AuditProvider";

   import { SearchInput} from "@dracul/common-frontend"
   import { DayjsMixin} from "@dracul/dayjs-frontend"


    export default {
        name: "AuditList",
        components: {SearchInput},
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
                    /*{
                        field: '',
                        operator: 'eq', //(eq|contain|regex|gt|lt|lte|gte)
                        value: ''
                    }*/
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
                    {text: this.$t('audit.labels.targetResource'), value: 'target'},
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
                    this.items = r.data.paginateAudit.items
                    this.totalItems = r.data.paginateAudit.totalItems
                }).catch(err => {
                    console.error(err)
                }).finally(() => this.loading = false)
            }
        }

    }
</script>



<template>
    <v-container fluid>
        <v-card class="mb-5">
            <v-card-title>
                {{ this.$t('audit.title') }}
            </v-card-title>

            <v-row style="height: 90%;">
                <v-col cols="12" sm="12">
                    <audit-filters @updateFilters="setFilters" @clearFilter="cleanFilters" v-model="filters">
                    </audit-filters>
                </v-col>
            </v-row>

        </v-card>

        <v-card>
            <v-col cols="12" sm="12" class="fill-height">
                <v-card>
                    <v-skeleton-loader v-if="loading" class="mx-auto" type="table"/>

                    <v-data-table v-else 
                        :headers="headers" 
                        :items="items"
                        
                        :search="search" 
                        :page.sync="pageNumber"
                        :server-items-length="totalItems" 
                        :items-per-page.sync="itemsPerPage"

                        :sort-by.sync="orderBy"
                        :sort-desc.sync="orderDesc"

                        :single-expand="false"
                        :loading="loading" 
                        
                        @update:page="fetch"
                        @update:sort-by="fetch" 
                        @update:sort-desc="fetch"
                        @update:items-per-page="fetch"
                    
                        :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50] }"
                    >

                        <template v-slot:[`item.role`]="{ item }">
                            {{ item.user && item.user.role ? item.user.role.name : '' }}
                        </template>

                        <template v-slot:[`item.user`]="{ item }">
                            {{ item.user ? item.user.username : '' }}
                        </template>

                        <template v-slot:[`item.action`]="{ item }">
                            <v-chip
                                label
                                outlined
                                class="rounded-0"
                                :color=getActionLabelColor(item.action)
                            >
                                {{ $t(`audit.actions.${item.action.toLowerCase()}`) }}
                            </v-chip>
                        </template>

                        <template v-slot:[`item.createdAt`]="{ item }">
                            {{ getDateTimeFormat(item.createdAt) }}
                        </template>

                        <template v-slot:[`item.changes`]="{ item }">
                            <v-menu
                                bottom
                                left
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        text 
                                        color="secondary"
                                        outlined
                                        tile
                                        
                                        v-bind="attrs"
                                        v-on="on"
                                        :disabled="item.action !== 'UPDATE'"
                                    >
                                        {{ item.changes.length }}
                                    </v-btn>
                                </template>

                                <v-data-table
                                    :headers=changeHeaders
                                    :items="item.changes"
                                    :hide-default-footer="true"
                                ></v-data-table>
                            </v-menu>

                        </template>


                        <template v-slot:[`item.details`]="{ item }">
                            {{ $t(`audit.actions.detailMessages.${item.action.toLowerCase()}`, {resourceID: item.details}) }}
                        </template>

                        <template slot="no-data">
                            <div class="text-xs-center" v-t="'common.noData'"></div>
                        </template>

                        <template slot="loading">
                            <div class="text-xs-center" v-t="'common.loading'"></div>
                        </template>
                    </v-data-table>
                </v-card>

            </v-col>
        </v-card>

    </v-container>
</template>

<script>
import AuditProvider from "../../providers/AuditProvider";
import AuditFilters from "./AuditFilters.vue";

// import { SearchInput} from "@dracul/common-frontend"
import { DayjsMixin } from "@dracul/dayjs-frontend"


export default {
    name: "AuditList",
    //    SearchInput, 
    components: { AuditFilters },
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
        headers() {
            return [
                //Entity Headers
                { text: this.$t('audit.labels.createdAt'), value: 'createdAt' },
                { text: this.$t('audit.labels.role'), value: 'role' },
                { text: this.$t('audit.labels.user'), value: 'user' },
                { text: this.$t('audit.labels.entity'), value: 'entity' },
                { text: this.$t('audit.labels.action'), value: 'action' },
                { text: this.$t('audit.labels.details'), value: 'details' },
                //Actions
                { text: this.$t('audit.labels.changes'), value: 'changes' },
            ]
        },
        changeHeaders() {
            return [
                { text: this.$t('audit.actions.changes.field'), value: 'field' },
                { text: this.$t('audit.actions.changes.oldValue'), value: 'oldValue' },
                { text: this.$t('audit.actions.changes.newValue'), value: 'newValue' },
            ]
        },
        getOrderBy() {
            return (Array.isArray(this.orderBy)) ? this.orderBy[0] : this.orderBy
        },
        getOrderDesc() {
            return (Array.isArray(this.orderDesc)) ? this.orderDesc[0] : this.orderDesc
        }
    },
    created() {
        this.fetch()
    },
    methods: {
        getActionLabelColor(action){
            const actionColors = {
                CREATE:'primary',
                READ:'secondary',
                UPDATE:'secondary',
                DELETE:'error',
            }

            return actionColors[action]
        },
        performSearch() {
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
                r.data.paginateAudit.items.forEach((item) => item.changes.length == 0 ? item.changes.length = 1 : null)
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
        },
        visualizeAuditChanges(audit){
            console.log(audit)
        }
    }

}
</script>

<style>
.v-data-table-header th {
    white-space: nowrap !important;
    align-self: center
}
</style>
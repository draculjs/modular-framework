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
                            <v-dialog
                                v-model="item.dialogVisible"
                                content-class='rounded-0'
                                scrollable
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        text 
                                        color="secondary"
                                        outlined
                                        tile
                                        v-bind="attrs"
                                        v-on="on"
                                    >
                                        {{ item.changes.length }}
                                    </v-btn>
                                </template>

                                <v-card
                                    class="rounded-0"
                                >

                                 <div class="sticky-header">

                                        <v-toolbar
                                            dense
                                        >
                                            Cambios de auditoria
                                            <v-spacer />
                                            
                                            <v-btn
                                                icon
                                                small
                                                @click="item.dialogVisible = false"
                                            >
                                                <v-icon>mdi-close</v-icon>
                                            </v-btn>
                                        </v-toolbar>

                                        <v-card
                                            class="d-flex pl-5 rounded-0 text-h2"
                                        >
                                            <v-card-text>
                                                <b>{{$t('audit.labels.createdAt')}}</b>: {{ getDateTimeFormat(item.createdAt) }}
                                            </v-card-text>

                                            <v-card-text>
                                                <b>{{$t('audit.labels.role')}}</b>: {{ item.user.role.name }}
                                            </v-card-text>

                                            <v-card-text>
                                                <b>{{$t('audit.labels.user')}}</b>: {{ item.user.username }}
                                            </v-card-text>

                                            <v-card-text>
                                                <b>{{$t('audit.labels.entity')}}</b>: {{ item.entity }}
                                            </v-card-text>

                                            <v-card-text>
                                                <b>{{$t('audit.labels.action')}}</b>: {{ $t(`audit.actions.${item.action.toLowerCase()}`) }}
                                            </v-card-text>

                                            <v-card-text>
                                                <b>{{$t('audit.labels.details')}}</b>: {{ item.details }}
                                            </v-card-text>
                                        </v-card>
                                    </div>

                                    <v-spacer></v-spacer>

                                    <div class="scrollable-content">
                                        <v-card
                                            outlined
                                            class="rounded-0"
                                            elevation="0"
                                        >
                                            <v-card-text
                                                class="px-8"
                                            >
                                                <v-data-table v-if="item.action == 'UPDATE'"
                                                    :headers="changeHeaders"
                                                    :items="item.changes"
                                                    :hide-default-footer="true"
                                                    class="rounded-0"
                                                >
                                                    <template v-slot:[`item.oldValue`]="{ item }">
                                                        {{ item.oldValue }}
                                                    </template>
                                                    <template v-slot:[`item.newValue`]="{ item }">
                                                        {{ item.newValue }}
                                                    </template>
                                                </v-data-table>

                                                <v-treeview v-if="item.dialogVisible"
                                                    :items="getAuditDataChanges(item)"
                                                    item-text="name"
                                                    item-children="children"
                                                    open-on-click
                                                    class="rounded-0"
                                                />
                                            </v-card-text>
                                        </v-card>
                                    </div>
                                </v-card>
                            </v-dialog>
                        </template>



                        <template v-slot:[`item.details`]="{ item }">
                            {{ $t(`audit.actions.detailMessages.${item.action.toLowerCase()}`, {resourceID: getDetailsText(item)}) }}
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
            orderBy: 'createdAt',
            orderDesc: true,
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
                    field: 'entity',
                    operator: '$regex',
                    value: null
                }
            ],
            dialogVisible: false, 
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
        getDetailsText(audit){

            console.log(`audit: ${JSON.stringify(audit, null, 2)}`)
            console.log(`typeof resource data: ${typeof audit.resourceData}`)

            if (audit && audit.resourceData && audit.resourceData !== '' && typeof audit.resourceData === 'string' && audit.resourceData !== null && audit.resourceData !== undefined) {
                try {
                    audit.resourceData = JSON.parse(audit.resourceData)
                } catch {
                    console.error('Invalid JSON format in resourceData')
                    return []
                }
            }
            
            return audit.resourceData?.Spec?.Name || audit.details
        },
        performSearch() {
            this.pageNumber = 1
            this.fetch()
        },
        async fetch() {
            this.loading = true

            try {
                const response = await AuditProvider.paginateAudit(
                    this.pageNumber,
                    this.itemsPerPage,
                    this.search,
                    this.filters,
                    this.getOrderBy,
                    this.getOrderDesc
                )

                this.items = response.data.paginateAudit.items.map(item => ({
                    ...item,
                    changes: item.changes.length === 0 ? [{ length: 1 }] : item.changes,
                    dialogVisible: false,
                }))

                this.totalItems = response.data.paginateAudit.totalItems
            } catch (err) {
                console.error(err)
            } finally {
                this.loading = false
            }
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
        getAuditDataChanges(audit) {
            if (audit && audit.resourceData && audit.resourceData !== '' && typeof audit.resourceData === 'string' && audit.resourceData !== null && audit.resourceData !== undefined) {
                try {
                    audit.resourceData = JSON.parse(audit.resourceData)
                } catch {
                    console.error('Invalid JSON format in resourceData')
                    return []
                }
            }

            if (!audit || typeof audit.resourceData !== 'object') return []

            const buildTree = (data) => {
                if (!data) return [];
                return Object.entries(data).map(([key, value]) => {
                    if (typeof value === 'object' && value !== null) {
                        return {
                            name: key,
                            children: buildTree(value) // Recursión para niveles anidados
                        }
                    }
                    return {
                        name: `${key}: ${String(value)}`
                    }
                })
            }

            return buildTree(audit.resourceData)
        }
    }

}
</script>

<style>
.v-data-table-header th {
    white-space: nowrap !important;
    align-self: center
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white; /* Ajusta según el diseño */
  box-shadow: 0 rgba(0, 0, 0, 0.1); /* Opcional */
}

.scrollable-content {
  max-height: 60vh; /* Ajusta según el tamaño del v-dialog */
  overflow-y: auto;
  padding: 16px; /* Opcional, para espaciar el contenido */
}
</style>
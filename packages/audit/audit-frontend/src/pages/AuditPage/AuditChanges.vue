<template>
    <v-dialog
        :content-class=" audit.action == 'UPDATE' ? 'rounded-sm' : 'rounded-0'"
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
                    {{ audit.changes.length }}
                </v-btn>
            </template>

            <v-data-table v-if="audit.action == 'UPDATE'"
                :headers=changeHeaders
                :items="audit.changes"
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

            <v-card>
                <v-treeview
                    :items="getAuditDataChanges(item)"
                    item-text="name"
                    item-children="children"
                    open-on-click
                    class="rounded-0"
                >
                </v-treeview>
            </v-card>

    </v-dialog>
</template>



<script>
    export default {
        name:"AuditChanges",
        props:{
            audit: {type: Object, required: true}
        },
        methods: {
            getAuditDataChanges(audit) {
                try {
                    if (audit && audit.resourceData && typeof audit.resourceData !== 'object'){
                        audit.resourceData = JSON.parse(audit.resourceData)
                    }
    
                    if (!audit || typeof audit.resourceData !== 'object' || !audit.resourceData) return [];
    
                    return Object.entries(audit.resourceData).map(([key, value]) => ({
                        name: key,
                        children: Array.isArray(value) || typeof value === 'object'
                            ? Object.entries(value).map(([subKey, subValue]) => ({ name: `${subKey}: ${subValue}` }))
                            : [{ name: `${value}` }]
                    }))
                } catch (error) {
                    console.error(`An error happened at the getAuditDataChanges method: '${error}'`)
                }
            }
        },
        computed: {
            changeHeaders() {
                return [
                    { text: this.$t('audit.actions.changes.field'), value: 'field' },
                    { text: this.$t('audit.actions.changes.oldValue'), value: 'oldValue' },
                    { text: this.$t('audit.actions.changes.newValue'), value: 'newValue' },
                ]
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>
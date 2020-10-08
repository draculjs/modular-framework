<template>

    <v-row row wrap>
        <v-col cols="12" md="4" offset-md="8">
          <search-input @search="fetch" v-model="search" />
        </v-col>

        <v-col cols="12">
            <v-data-table
                    class="mt-3"
                    :headers="headers"
                    :items="items"
                    :search="search"
                    :single-expand="false"
                    :server-items-length="totalItems"
                    :items-per-page="itemsPerPage"
                    :loading="loading"
                    :page.sync="pageNumber"
                    :sort-by.sync="orderBy"
                    :sort-desc.sync="orderDesc"
                    @update:page="fetch"
                    @update:sort-by="fetch"
                    @update:sort-desc="fetch"
            >

                <template slot="no-data">
                    <div class="text-xs-center" v-t="'common.noData'"></div>
                </template>

                <template slot="loading">
                    <div   class="text-xs-center" v-t="'common.loading'"></div>
                </template>


                <template v-slot:item.action="{ item }">
                    <show-button  @click="$emit('show', item)" />
                    <edit-button  @click="$emit('update', item)" />
                    <delete-button @click="$emit('delete', item)" />
                </template>

            </v-data-table>
        </v-col>
    </v-row>
</template>
<script>
    import SearchInput from "../SearchInput/SearchInput";
    import ShowButton from "../Crud/ShowButton/ShowButton";
    import EditButton from "../Crud/EditButton/EditButton";
    import DeleteButton from "../Crud/DeleteButton/DeleteButton";
    export default {
        name: 'CrudExampleCustomList',
        components: {DeleteButton, EditButton, ShowButton, SearchInput},
        props: {
            items: Array,
            totalItems: Number,
            loading: Boolean
        },
        data() {
            return {
                orderBy: null,
                orderDesc: false,
                itemsPerPage: 5,
                pageNumber: 1,
                search: '',
                headers: [
                    //Headers of your entity
                    {text: this.$t('common.name'), value: 'name'},
                    //Actions edit/delete/show...
                    {text: this.$t('common.actions'), value: 'action', sortable: false},
                ],
            }
        },
        computed: {
            getOrderBy() {
                return (Array.isArray(this.orderBy)) ? this.orderBy[0] : this.orderBy
            },
            getOrderDesc() {
                return (Array.isArray(this.orderDesc)) ? this.orderDesc[0] : this.orderDesc
            }
        },
        methods:{
            fetch(){
                this.$emit('fetch',{
                    orderBy: this.getOrderBy,
                    orderDesc: this.getOrderDesc,
                    pageNumber: this.pageNumber,
                    itemsPerPage: this.itemsPerPage,
                    search: this.search
                })
            }
        }
    }
</script>

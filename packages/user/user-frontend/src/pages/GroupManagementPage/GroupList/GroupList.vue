<template>
  <v-row row wrap>

    <v-col cols="12" sm="6" md="4" offset-md="8" offset-sm="6">
      <search-input @search="performSearch" v-model="search"/>
    </v-col>

    <v-col cols="12">
      <v-data-table class="mt-3"
                    :headers="headers"
                    :items="items"
                    :search="search"
                    :single-expand="false"
                    :loading="loading"
                    :server-items-length="totalItems"
                    :items-per-page.sync="itemsPerPage"
                    :page.sync="pageNumber"
                    :sort-by.sync="orderBy"
                    :sort-desc.sync="orderDesc"
                    :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50] }"
                    @update:page="fetch"
                    @update:items-per-page="fetch"
                    @update:sort-by="fetch"
                    @update:sort-desc="fetch"
      >

        <div slot="no-data" color="info" outline class="text-xs-center">Sin datos</div>

        <div slot="loading" outline color="info">Cargando</div>

        <template v-slot:item.avatar="{ item }">
          <v-avatar size="36px" :color="item.color?item.color:'grey'">
            <span class="white--text headline">{{ item.name.charAt(0) }}</span>
          </v-avatar>
        </template>

        <template v-slot:item.users="{ item }">
                    <span>
                        {{ item.users.map(user => user.username).join(", ") }}
                    </span>
        </template>

        <template v-slot:item.action="{ item }">
          <v-icon color="info"
                  small class="mr-2"
                  @click="$emit('open-show', item)"
          >
            search
          </v-icon>

          <v-icon color="primary"
                  small
                  class="mr-2"
                  @click="$emit('open-edit', item)"
          >
            edit
          </v-icon>

          <v-icon color="red"
                  small
                  class="mr-2"
                  @click="$emit('open-delete', item)"
          >
            delete
          </v-icon>
        </template>

      </v-data-table>
    </v-col>
  </v-row>


</template>

<script>
import {SearchInput} from '@dracul/common-frontend'
import GroupProvider from "../../../providers/GroupProvider";

export default {
  name: "GroupList",
  components: {SearchInput},
  data() {
    return {
      items: [],
      totalItems: null,
      loading: false,
      search: '',
      itemsPerPage: 5,
      pageNumber: 1,
      orderBy: null,
      orderDesc: false
    }
  },
  computed: {
    headers() {
      return [
        {text: this.$t('group.label.avatar'), value: 'avatar'},
        {text: this.$t('group.label.name'), value: 'name'},
        {text: this.$t('group.label.color'), value: 'color'},
        {text: this.$t('group.label.users'), value: 'users'},
        {text: this.$t('common.actions'), value: 'action', sortable: false},
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
    performSearch() {
      this.pageNumber = 1
      this.fetch()
    },
    fetch() {

      this.loading = true
      GroupProvider.paginateGroups(
          this.itemsPerPage,
          this.pageNumber,
          this.search,
          this.getOrderBy,
          this.getOrderDesc
      )
          .then(r => {
            this.items = r.data.groupsPaginate.items
            this.totalItems = r.data.groupsPaginate.totalItems
          }).catch(err => {
        //TODO improve handle error (show messages to user)
        console.error(err)
      }).finally(() => this.loading = false)
    }
  }
}
</script>



<template>

  <v-row row wrap>
    <v-col cols="12" sm="6" md="4">
      <v-checkbox :label="$t('user.onlyActiveUsers')" v-model="activeUsers" @change="fetch"/>
    </v-col>
    <v-col cols="12" sm="6" md="4" offset-md="4">
      <search-input @search="setSearch" v-model="searchInput"/>
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
          @update:items-per-page="fetch"
          @update:sort-by="fetch"
          @update:sort-desc="fetch"
      >

        <template slot="no-data">
          <div outline color="info" v-t="'common.noData'"></div>
        </template>

        <template slot="loading">
          <div color="info" outline class="text-xs-center" v-t="'common.loading'"></div>
        </template>

        <template v-slot:item.img="{ item }">
          <v-avatar size="36px">
            <v-img v-if="item.avatarurl" :src="item.avatarurl"/>
            <v-icon v-else large >account_circle</v-icon>
          </v-avatar>
        </template>

        <template v-slot:item.active="{ item }">
          <div v-if="item.active">
            <v-icon color="success">check_circle</v-icon>
          </div>
          <div v-else>
            <v-icon color="error">highlight_off</v-icon>
          </div>
        </template>

        <template v-slot:item.action="{ item }">
          <v-icon
              small
              color="info"
              class="mr-1"
              @click="$emit('open-show', item)"
          >
            search
          </v-icon>
          <v-icon
              small
              color="info"
              class="mr-1"
              @click="$emit('open-apikey', item)"
          >
            api
          </v-icon>

          <v-icon
              v-if="canEdit"
              small
              color="purple"
              class="mr-1"
              @click="$emit('open-edit', item)"
          >
            edit
          </v-icon>

          <v-icon
              v-if="canEdit"
              small
              color="orange"
              class="mr-1"
              @click="$emit('open-change-avatar', item)"
          >
            face
          </v-icon>

          <v-icon
              v-if="canEdit"
              small
              color="purple"
              class="mr-1"
              @click="$emit('open-change-password', item)"
          >
            lock
          </v-icon>


          <v-icon
              v-if="canDelete"
              color="red"
              small
              class="mr-1"
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
import UserProvider from "../../../providers/UserProvider";
import {SearchInput} from '@dracul/common-frontend'
import {mapGetters} from "vuex";

export default {
  name: 'UserList',
  components: {SearchInput},
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
      searchInput: "",
      activeUsers: false
    }
  },
  computed: {
    headers() {
      return [
        {text: '', value: 'img', sortable: false},
        {text: this.$t('user.label.fullname'), value: 'name'},
        {text: this.$t('user.label.username'), value: 'username'},
        {text: this.$t('user.label.email'), value: 'email'},
        {text: this.$t('user.label.role'), value: 'role.name'},
        {text: this.$t('user.label.active'), value: 'active'},
        {text: this.$t('user.label.actions'), value: 'action', sortable: false},
        {text: '', value: 'data-table-expand'},
      ]
    },
    getOrderBy() {
      return (Array.isArray(this.orderBy)) ? this.orderBy[0] : this.orderBy
    },
    getOrderDesc() {
      return (Array.isArray(this.orderDesc)) ? this.orderDesc[0] : this.orderDesc
    },
    ...mapGetters(['hasPermission']),
    canEdit() {
      return this.hasPermission('SECURITY_USER_EDIT')
    },
    canDelete() {
      return this.hasPermission('SECURITY_USER_DELETE')
    }

  },
  created() {
    this.fetch()
  },
  methods: {
    setSearch() {
      this.pageNumber = 1
      this.search = this.searchInput
      this.fetch()
    },
    fetch() {
      this.loading = true
      UserProvider.paginateUsers(
          this.itemsPerPage,
          this.pageNumber,
          this.search,
          this.getOrderBy,
          this.getOrderDesc,
          this.activeUsers
      )
          .then(r => {
            this.items = r.data.paginateUsers.users
            this.totalItems = r.data.paginateUsers.totalItems
          }).catch(err => {
        //TODO improve handle error (show messages to user)
        console.error(err)
      }).finally(() => this.loading = false)
    }
  }

}
</script>

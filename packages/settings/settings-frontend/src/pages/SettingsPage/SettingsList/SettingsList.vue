<template>
  <v-row row wrap>

    <v-col cols="12" sm="6" md="4" offset-md="8" offset-sm="6">
      <search-input @search="performSearch" v-model="search"/>
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

        <template v-slot:item.value="{item}">

          <template v-if="item.type === 'boolean'">
            <v-icon v-if="item.value === 'enable' " color="green">done</v-icon>
            <v-icon v-else color="red">clear</v-icon>
          </template>

          <template v-else>
            {{ item.label[getLanguage] }}
          </template>

        </template>


        <template v-slot:item.label="{item}">
          {{ item.label[getLanguage] }}
        </template>


        <template slot="no-data">
          <div class="text-xs-center" v-t="'common.noData'"></div>
        </template>

        <template slot="loading">
          <div class="text-xs-center" v-t="'common.loading'"></div>
        </template>

        <template v-slot:item.action="{ item }">
          <show-button @click="$emit('show', item)"/>
          <edit-button @click="$emit('update', item)"/>
        </template>

      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import SettingsProvider from "../../../providers/SettingsProvider";
import {EditButton, ShowButton, SearchInput} from '@dracul/common-frontend'
import {mapGetters} from "vuex";

export default {
  name: "SettingsList",
  components: {EditButton, ShowButton, SearchInput},

  data() {
    return {
      items: [],
      totalItems: null,
      loading: false,
      orderBy: null,
      orderDesc: false,
      itemsPerPage: 10,
      pageNumber: 1,
      search: ''
    }
  },
  computed: {
    ...mapGetters(['getLanguage']),
    headers() {
      return [
        //Entity Headers
        //{text: this.$t('settings.settings.labels.key'), value: 'key'},
        {text: this.$t('settings.settings.labels.label'), value: 'label'},
        {text: this.$t('settings.settings.labels.value'), value: 'value'},
        //Actions
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
      SettingsProvider.paginateSettings(
          this.pageNumber,
          this.itemsPerPage,
          this.search,
          this.getOrderBy,
          this.getOrderDesc
      ).then(r => {
        this.items = r.data.settingsPaginate.items
        this.totalItems = r.data.settingsPaginate.totalItems
      }).catch(err => {
        console.error(err)
      }).finally(() => this.loading = false)
    }
  }

}
</script>



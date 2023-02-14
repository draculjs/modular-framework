<template>
  <v-row row wrap>

    <v-col cols="12" sm="6" md="4" offset-md="8" offset-sm="6">
      <search-input @search="performSearch" v-model="search"/>
    </v-col>

    <v-col cols="12" v-for="group in groups" :key="group.id">
      <v-card v-if="group.items.length > 0">
        <v-card-title>{{ group.name }}</v-card-title>
        <v-data-table v-data-table
            class="mt-3"
            :headers="headers"
            :items="group.items"
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

            <template v-else-if="item.type === 'password'">
              {{getCensoredPassword(item.value)}}
            </template>

            <template v-else>
              {{ item.value }}
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
            <edit-button v-if="userCanEditSettings" @click="$emit('update', item)"/>
          </template>

        </v-data-table>
      </v-card>
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
      groups: [],
      items: [],
      totalItems: null,
      loading: false,
      orderBy: null,
      orderDesc: false,
      itemsPerPage: 25,
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
    },
    userCanEditSettings() {
      return this.$store.getters.hasPermission('SETTINGS_UPDATE')
    }
  },
  async created() {
    await this.fetch()
  },
  methods: {
    performSearch() {
      this.pageNumber = 1
      this.fetch()
    },
    async fetch() {
      try {
        this.loading = true
        const { data: { settingsPaginate: { items, totalItems } } } = await SettingsProvider.paginateSettings(
          this.pageNumber,
          this.itemsPerPage,
          this.search,
          this.getOrderBy,
          this.getOrderDesc)

        this.items = items
        this.totalItems = totalItems
        const { data : { fetchSettingsGroup } } = await SettingsProvider.fetchSettingsGroup()
        this.groups = fetchSettingsGroup.map(({_id, name, settings}) => {
          const newGroup = {}
          newGroup.id = _id
          newGroup.name = name
          newGroup.totalItems = settings.length
          newGroup.items = []
          settings.forEach(setting => {
            this.items.forEach(item => {
              if(item.key == setting) newGroup.items.push(item)
            })
          })
          return newGroup
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    getCensoredPassword(pass){
      let censoredPass = ''

      for (let i = 0; i < pass.length; i++) {
        censoredPass += '*'
      }

      return censoredPass
    }
  }

}
</script>



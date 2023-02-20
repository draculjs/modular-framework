<template>
  <v-row row wrap>

    <v-col cols="12" sm="6" md="4" offset-md="8" offset-sm="6">
      <search-input @search="performSearch" v-model="search"/>
    </v-col>

    <v-col cols="12" v-for="group in groups" :key="group.id">
      <v-card v-if="group.settings.length > 0">
        <v-card-title>{{ group.group }}</v-card-title>
          <v-data-table
            class="mt-3"
            :headers="headers"
            :items="group.settings"
            :search="search"
            :single-expand="false"
            :loading="loading"
            disable-pagination hide-default-footer
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
      loading: false,
      search: ''
    }
  },
  computed: {
    ...mapGetters(['getLanguage']),
    headers() {
      return [
        //Entity Headers
       // {text: this.$t('settings.settings.labels.key'), value: 'key'},
        {text: this.$t('settings.settings.labels.label'), value: 'label'},
        {text: this.$t('settings.settings.labels.value'), value: 'value'},
        //Actions
        {text: this.$t('common.actions'), value: 'action', sortable: false},
      ]
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
        const response = await SettingsProvider.fetchSettingsGroup()
        console.log("response",response)
        this.groups = response.data.fetchSettingsGroup
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>



<template>
  <v-row row wrap>

    <v-col cols="12">
      <v-row justify="space-between">
        <v-col cols="12" sm="6" md="2">
          <v-switch
              prepend-icon="autorenew"
              v-model="autoRefresh"
              @change="doAutoRefresh"
          ></v-switch>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <search-input @search="performSearch" v-model="search"/>
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

        <template v-slot:item.state="{ item }">
          {{ $t(`queue.queue.state.${item.state}`) }}
        </template>

        <template v-slot:item.blockedUntil="{ item }">
          {{ getDateTimeFormat(item.blockedUntil) }}
        </template>

        <template v-slot:item.progress="{ item }">
          {{ item.progress }}%
        </template>

        <template v-slot:item.retries="{ item }">
          {{ item.retries }}/{{ item.maxRetries }}
        </template>


        <template v-slot:item.done="{ item }">
          <div v-if="item.done">
            <v-icon color="success">check_circle</v-icon>
          </div>
          <div v-else>
            <v-icon color="red">pending</v-icon>
          </div>
        </template>

        <template v-slot:item.output="{ item }" >
          <span v-html="item.output"></span>
        </template>

        <template v-slot:item.error="{ item }" >
          <span v-html="item.error"></span>
        </template>

        <template v-slot:item.info="{ item }" >
          <span v-html="item.info"></span>
        </template>

        <template slot="no-data">
          <div class="text-xs-center" v-t="'common.noData'"></div>
        </template>

        <template slot="loading">
          <div class="text-xs-center" v-t="'common.loading'"></div>
        </template>

        <template v-slot:item.action="{ item }">
          <show-button @click="$emit('show', item)"/>
          <v-btn icon small class="mx-1" color="indigo" :to="{name: 'JobPage', params: {id:item.id}}">
            <v-icon small>preview</v-icon>
          </v-btn>

          <delete-button v-if="canDelete" @click="$emit('delete', item)"/>
        </template>

      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import QueueProvider from "../../../providers/QueueProvider";

import {DeleteButton, ShowButton, SearchInput} from "@dracul/common-frontend"
import {DayjsMixin} from "@dracul/dayjs-frontend";

export default {
  name: "QueueList",
  components: {DeleteButton, ShowButton, SearchInput},
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
      autoRefresh: false
    }
  },
  computed: {
    headers() {
      return [
        //Entity Headers
        {text: this.$t('queue.queue.labels.topic'), value: 'topic'},
        {text: this.$t('queue.queue.labels.done'), value: 'done'},
        {text: this.$t('queue.queue.labels.state'), value: 'state'},
        {text: this.$t('queue.queue.labels.progress'), value: 'progress'},
        {text: this.$t('queue.queue.labels.retries'), value: 'retries'},
        {text: this.$t('queue.queue.labels.blockedUntil'), value: 'blockedUntil'},
        //{text: this.$t('queue.queue.labels.workerId'), value: 'workerId'},
        {text: this.$t('queue.queue.labels.info'), value: 'info'},
        {text: this.$t('queue.queue.labels.error'), value: 'error'},
        {text: this.$t('queue.queue.labels.output'), value: 'output'},
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
    canDelete() {
      return this.$store.getters.hasPermission('QUEUE_DELETE')
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
    doAutoRefresh() {
      this.fetch().then(() => {
        if (this.autoRefresh) {
          setTimeout(this.doAutoRefresh, 3000)
        }
      })
    },
    fetch() {
      return new Promise((resolve) => {
        this.loading = true
        QueueProvider.paginateQueues(
            this.pageNumber,
            this.itemsPerPage,
            this.search,
            this.getOrderBy,
            this.getOrderDesc
        ).then(r => {
          this.items = r.data.queuePaginate.items
          this.totalItems = r.data.queuePaginate.totalItems
        }).catch(err => {
          console.error(err)
        }).finally(() => {
          this.loading = false
          resolve()
        })
      })

    }
  }

}
</script>



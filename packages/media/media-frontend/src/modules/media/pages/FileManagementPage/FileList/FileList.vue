<template>
  <v-row row wrap>

    <file-filters
      v-on:updateFilters="setFilters"
      v-on:clearFilter="clearFilters"
      v-model="filters"
    />

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

        <template slot="no-data">
          <div class="text-xs-center" v-t="'common.noData'"></div>
        </template>

        <template slot="loading">
          <div class="text-xs-center" v-t="'common.loading'"></div>
        </template>

        <template v-slot:item.size="{item}">
          {{ item.size.toFixed(2) }} Mb
        </template>

        <template v-slot:item.createdAt="{item}">
          {{ formatDate(item.createdAt) }}
        </template>

        <template v-slot:item.lastAccess="{item}">
          {{ formatDate(item.lastAccess) }}
        </template>

        <template v-slot:item.action="{ item }">
          <show-button @click="$emit('show', item)"/>
          <edit-button @click="$emit('update', item)"/>
          <delete-button @click="$emit('delete', item)"/>
        </template>

      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import FileProvider from "../../../providers/FileProvider";

import {DeleteButton, EditButton, ShowButton, SearchInput} from "@dracul/common-frontend"
import redeableBytesMixin from "../../../mixins/readableBytesMixin";
import moment from "moment-timezone"
import FileFilters from "../FileFilters/FileFilters"

export default {
  name: "FileList",
  mixins: [redeableBytesMixin],
  components: {DeleteButton, EditButton, ShowButton, SearchInput, FileFilters},
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
          field: 'dateFrom',
          operator: '$gte', // puede ser eq|contain|regex|gt|lt|gte|lte
          value: null
        },
        {
          field: 'dateTo',
          operator: '$lte',
          value: null
        },
        {
          field: 'filename',
          operator: '$regex',
          value: null
        },
        {
          field: 'createdBy.username',
          operator: '$regex',
          value: null
        },
        {
          field: 'type',
          operator: '$regex',
          value: null
        },
        {
          field: 'size',
          operator: '$gte',
          value: null
        }
      ]
    }
  },
  methods: {

    performSearch() {
      this.pageNumber = 1
      this.fetch()
    },
    fetch() {
      this.loading = true
      FileProvider.paginateFiles(
          this.pageNumber,
          this.itemsPerPage,
          this.search,
          this.filters,
          this.getOrderBy,
          this.getOrderDesc
      ).then(r => {
        this.items = r.data.filePaginate.items
        this.totalItems = r.data.filePaginate.totalItems
      }).catch(err => {
        console.error(err)
      }).finally(() => this.loading = false)
    },
    setFilters(fileFilters) {
      this.filters = fileFilters
      this.fetch()
    },
    clearFilters() {
      this.filters = [
        {
          field: 'dateFrom',
          operator: '$gte',
          value: null
        },
        {
          field: 'dateTo',
          operator: '$lte',
          value: null
        },
        {
          field: 'filename',
          operator: '$regex',
          value: null
        },
        {
          field: 'createdBy.username',
          operator: '$regex',
          value: null
        },
        {
          field: 'type',
          operator: '$regex',
          value: null
        },
        {
          field: 'size',
          operator: '$expr',
          value: null
        }
      ]
    }
  },
  watch: {
    message: function(value) {
      if (value) {
        this.filters = true;
      }
    },
  },
  computed: {
    headers() {
      return [
        //Entity Headers
        {text: this.$t('media.file.filename'), value: 'filename'},
        {text: this.$t('media.file.type'), value: 'type'},
        {text: this.$t('media.file.size'), value: 'size'},
        {text: this.$t('media.file.createdAt'), value: 'createdAt'},
        {text: this.$t('media.file.lastAccess'), value: 'lastAccess'},
        {text: this.$t('media.file.createdBy'), value: 'createdBy.username'},
        //Actions
        {text: this.$t('common.actions'), value: 'action', sortable: false},
      ]
    },
    formatDate() {
      return (date) => moment(parseInt(date)).tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD')
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
  }
  

}
</script>



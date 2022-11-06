<template>
  <crud-layout :title="this.$t('media.userStorage.title')" :subtitle="this.$t('media.userStorage.subtitle')">
    <template v-slot:list>
      <loading v-if="loadingPermissions"></loading>
      <v-data-table
          v-else
          :headers="headers"
          :search="search"
          :items="users"
          sort-by="calories"
          class="elevation-0"
      >
        <template v-slot:top>
          <v-toolbar
              flat
          >
            <v-toolbar-title>{{ $t("media.userStorage.title2") }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                :label="$t('base.search')"
                single-line
                hide-details
            ></v-text-field>
            <user-storage-update v-if="!!userToUpdate"
                                 :open="!!userToUpdate"
                                 :userStorageForm="userToUpdate"
                                 v-on:close="userToUpdate=null"
                                 v-on:roleUpdated="onRoleUpdated"
            />

          </v-toolbar>
        </template>
        <template v-slot:item.fileExpirationTime="{ item }">
          {{ item.fileExpirationTime }} {{ $t("media.userStorage.days") }}
        </template>
        <template v-slot:item.maxFileSize="{ item }">
          {{ item.maxFileSize.toFixed(2) }} MB
        </template>
        <template v-slot:item.capacity="{ item }">
          {{ item.usedSpace.toFixed(2) }}/{{ item.capacity }} MB
        </template>
        <template v-slot:item.usedSpace="{ item }">
          {{ percentageUsed(item) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
              outlined
              small
              color="secondary"
              @click="editItem(item)"
          >{{ $t("media.userStorage.edit") }}
          </v-btn>
        </template>
      </v-data-table>
      <v-snackbar
          v-model="snackbar"
          :timeout="timeout"
          :color="snackbarColor"
      >
        {{ $t("media.userStorage.updated") }}

        <template v-slot:action="{ attrs }">
          <v-btn
              color="white"
              text
              v-bind="attrs"
              @click="snackbar = false"
          >
            X
          </v-btn>
        </template>
      </v-snackbar>
    </template>
  </crud-layout>
</template>

<script>
import {CrudLayout} from "@dracul/common-frontend"
import UserStorageUpdate from './UserStorageUpdate/UserStorageUpdate.vue';
import userStorageProvider from '../../providers/UserStorageProvider'
import {Loading} from "@dracul/common-frontend"

export default {
  name: "UserStorageCrud",
  components: {CrudLayout, Loading, UserStorageUpdate},
  data() {
    return {
      search: "",
      user: [],
      loadingPermissions: true,
      userToUpdate: null,
      flashMessage: null,
      headers: [
        {
          text: this.$t("media.userStorage.user"),
          align: 'start',
          sortable: false,
          value: 'user.name',
        },
        {text: this.$t("media.userStorage.fileExpirationTime"), value: 'fileExpirationTime', align: 'center'},
        {text: this.$t("media.userStorage.maxFileSize"), value: 'maxFileSize', align: 'center'},
        {text: this.$t("media.userStorage.capacity"), value: 'capacity', align: 'center'},
        {text: this.$t("media.userStorage.percentage"), value: 'usedSpace', align: 'center'},
        {text: this.$t("media.userStorage.actions"), value: 'actions', sortable: false, align: 'center'},
      ],
      users: [],
      snackbar: false,
      snackbarColor: "",
      timeout: 3000,
    }
  },

  methods: {
    percentageUsed(item) {
      return item.capacity > 0 ? parseFloat(item.usedSpace * 100 / item.capacity).toFixed(2) + "%" : "-"
    },
    load() {
      this.users = []
      this.loadingPermissions = true
      userStorageProvider.fetchUserStorage()
          .then(r => {
            this.users = r.data.userStorageFetch
          })
          .catch(err => console.error(err))
          .finally(this.loadingPermissions = false)
    },
    onRoleUpdated() {
      this.users = []
      this.loadingPermissions = true
      this.load()
      this.snackbarColor = "success"
      this.snackbar = true
    },
    editItem(user) {
      this.userToUpdate = user
    },
  },
  created() {
    this.load()
  },
}

</script>

<style scoped>

</style>

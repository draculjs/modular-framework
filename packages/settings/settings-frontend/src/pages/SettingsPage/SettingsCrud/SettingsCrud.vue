<template>
  <crud-layout :title="title" :subtitle="subtitle">

    <template v-slot:list>
      <settings-list
          ref="list"
          @update="update"
          @delete="remove"
          @show="show"

      />
    </template>


    <settings-update v-if="updating"
        :open="updating"
        :item="itemToEdit"
        v-on:itemUpdated="onItemUpdated"
        v-on:close="updating=false"
    />

    <settings-show v-if="showing"
      :open="showing"
      :item="itemToShow"
      v-on:close="showing=false"
    />


    <snackbar v-model="flash"/>

  </crud-layout>
</template>

<script>

import SettingsUpdate from "../SettingsUpdate";
import SettingsShow from "../SettingsShow";
import SettingsList from "../SettingsList";

import {CrudLayout, Snackbar} from '@dracul/common-frontend'

export default {
  name: "SettingsCrud",
  components: {
    CrudLayout,
    Snackbar,
    SettingsUpdate,
    SettingsShow,
    SettingsList
  },
  data() {
    return {
      title: 'settings.settings.title',
      subtitle: 'settings.settings.subtitle',
      flash: null,
      creating: false,
      updating: false,
      deleting: false,
      showing: false,
      itemToEdit: null,
      itemToDelete: null,
      itemToShow: null,
    }
  },
  methods: {
    //On
    onItemCreated() {
      this.$refs.list.fetch()
      this.flash = this.$t("common.created")
    },
    onItemUpdated() {
      this.$refs.list.fetch()
      this.flash = this.$t("common.updated")
    },
    onItemDeleted() {
      this.$refs.list.fetch()
      this.flash = this.$t("common.deleted")
    },
    //Open
    create() {
      this.creating = true
    },
    update(item) {
      this.updating = true
      this.itemToEdit = item
    },
    show(item) {
      this.showing = true
      this.itemToShow = item
    },
    remove(item) {
      this.deleting = true
      this.itemToDelete = item
    }
  }

}
</script>



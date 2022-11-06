<template>
  <crud-layout :title="title" :subtitle="subtitle">

    <template v-slot:list>
      <file-list
          ref="list"
          @update="update"
          @delete="remove"
          @show="show"

      />
    </template>

    <add-button
        v-if="$store.getters.hasPermission('FILE_CREATE')"
        @click="create"

    ></add-button>

    <file-create v-if="creating"
                 :open="creating"
                 v-on:itemCreated="onItemCreated"
                 v-on:close="creating=false"
    />

    <file-update v-if="updating"
                 :open="updating"
                 :item="itemToEdit"
                 v-on:itemUpdated="onItemUpdated"
                 v-on:close="updating=false"
    />

    <file-show v-if="showing"
               :open="showing"
               :item="itemToShow"
               v-on:close="showing=false"
    />

    <file-delete v-if="deleting"
                 :open="deleting"
                 :item="itemToDelete"
                 v-on:itemDeleted="onItemDeleted"
                 v-on:close="deleting=false"
    />

    <snackbar v-model="flash"/>

  </crud-layout>
</template>

<script>
import FileUpdate from "../FileUpdate";
import FileDelete from "../FileDelete";
import FileShow from "../FileShow";
import FileList from "../FileList";

import {CrudLayout, AddButton, Snackbar} from "@dracul/common-frontend"
import FileCreate from "../FileCreate/FileCreate";

export default {
  name: "FileCrud",
  components: {
    FileCreate,
    CrudLayout, AddButton, Snackbar,
    FileUpdate,
    FileDelete,
    FileShow,
    FileList
  },
  data() {
    return {
      title: 'media.file.title',
      subtitle: 'media.file.subtitle',
      flash: null,
      creating: false,
      updating: false,
      deleting: false,
      showing: false,
      itemToEdit: null,
      itemToDelete: null,
      itemToShow: null,
      timeoutSnackbar: 10000,
    }
  },
  beforeMount(){
    if(this.$store.getters.getRole === "visualizer"){
      this.subtitle = 'media.file.visualizerSubtitle'
    }
  },
  methods: {
    //On
    onItemCreated() {
      this.$refs.list.fetch();
      this.flash = this.$t("common.created");
    },
    onItemUpdated() {
      this.$refs.list.fetch()
      this.flash = this.$t("common.updated");
    },
    onItemDeleted() {
      this.$refs.list.fetch()
      this.flash = this.$t("common.deleted");
    },
    //Open
    create() {
      this.creating = true;
    },
    update(item) {
      this.updating = true;
      this.itemToEdit = item;
    },
    show(item) {
      this.showing = true;
      this.itemToShow = item;
    },
    remove(item) {
      this.deleting = true;
      this.itemToDelete = item;
    },
  }

}
</script>



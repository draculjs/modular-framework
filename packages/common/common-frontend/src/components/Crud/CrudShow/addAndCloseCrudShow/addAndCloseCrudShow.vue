<template>
  <v-dialog :fullscreen="fullscreen" :value="open" max-width="850" persistent>
    <v-card>

      <toolbar-dialog
          info
          :title="title"
          @close="$emit('close')"
      />

      <v-card-text>
        <slot></slot>
      </v-card-text>

      <v-divider/>

      <v-card-actions>
        <v-spacer></v-spacer>
        <close-button color="grey" @click="$emit('close')"></close-button>
        <v-btn v-if="!createdFile"text color="secondary" @click="$emit('createFile')" :disabled="!this.filePicked">Crear</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ToolbarDialog from "../../../ToolbarDialog";
import CloseButton from "../../../CloseButton/CloseButton";

export default {
  name: "addAndCloseCrudShow",
  components: {CloseButton, ToolbarDialog},
  props: {
    title: {type: String, default: 'common.show'},
    open: {type: Boolean, default: false},
    fullscreen: {type: Boolean, default: false},
    filePicked : {type: Boolean, default: false},
  },
  data() {
    return {
      createdFile : false,
    }
  },
  methods: {
    fileWasCreated() {
      this.createdFile = true;
    }
  }
};

</script>

<style scoped>

</style>

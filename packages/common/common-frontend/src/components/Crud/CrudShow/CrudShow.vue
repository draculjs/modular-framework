<template>
  <v-dialog :fullscreen="fullscreen" :value="open" max-width="75vw" persistent>
    <v-card>

      <toolbar-dialog
        info
        :title="title"
        @close="$emit('close')"
      />

      <v-card-text style="overflow: auto">
        <slot></slot>
      </v-card-text>

      <v-divider/>

      <v-card-actions>
        <v-spacer/>
        <close-button @click="$emit('close')"/>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ToolbarDialog from "../../ToolbarDialog";
import CloseButton from "../../CloseButton/CloseButton.vue";

export default {
  name: "CrudShow",
  components: {CloseButton, ToolbarDialog},
  props: {
    title: {type: String, default: 'common.show'},
    open: {type: Boolean, default: false},
    fullscreen: {type: Boolean, default: false}
  }
}
</script>

<style scoped>

</style>

<template>
  <v-dialog
      :fullscreen="fullscreen"
      v-model="value"
      :width="width"
      :persistent="persistent"
a   >
    <v-card>
      <toolbar-dialog
          :danger="danger"
          :title="title"
          @close="$emit('close')"
      />


      <v-card-text>
        <slot></slot>
      </v-card-text>


    </v-card>
  </v-dialog>
</template>

<script>
import ToolbarDialog from "../ToolbarDialog/ToolbarDialog";

export default {
  name: "SimpleDialog",
  components: {ToolbarDialog},
  props: {
    value: {type: Boolean, default: false},
    title: {type: String, default: ''},
    danger: {type: Boolean, default: false},
    fullscreen: {type: Boolean, default: false},
    width: {type: String},
    persistent: {type: Boolean, default: true}
  }
}
</script>

<style scoped>

</style>

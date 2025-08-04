<template>
  <div>
    <v-card class="elevation-6">
      <v-card-title class="d-flex justify-space-between align-center">
        <span v-t="title"></span>
        <v-btn
          v-if="addButton"
          icon
          small
          color="primary"
          @click="$emit('add')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-subtitle v-t="subtitle" />
      <v-card-text>
        <slot name="list"></slot>
      </v-card-text>
    </v-card>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "CrudLayout",
  props: {
    title: String,
    subtitle: String,
    addButton: Boolean
  }
}
</script>

<style scoped>
</style>
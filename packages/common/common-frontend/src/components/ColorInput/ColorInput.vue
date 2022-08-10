<template>
  <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :z-index="9099" eager
      max-width="250"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
          v-on="on"
          prepend-icon="palette"
          type="text"
          v-model="colorValue"
          :label="label"
          :placeholder="label"
          :rules="rules"
          :error="hasErrors"
          :error-messages="getMessageErrors"
          :color="color"
          :clearable="clearable"
      >
        <template v-slot:append>
          <v-chip :class="colorValue" small :style="{background: colorValue}">
            {{ colorValue }}
          </v-chip>
        </template>
      </v-text-field>
    </template>
    <v-color-picker

        v-model="colorValue"
        flat
        mode="hexa"
    />
  </v-menu>
</template>
<script>
export default {
  name: 'color-input',
  props: {
    value: String,
    color: String,
    label: String,
    getMessageErrors: Array,
    hasErrors: Boolean,
    rules: Array,
    clearable: {type: Boolean, default: true}
  },
  data() {
    return {
      menu: false
    }
  },
  computed: {
    colorValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val.substring(0, 7))
      }
    },
    getStyleColor() {
      return (style) => style + ": " + this.value
    },
  }
}
</script>
<style scoped>

</style>

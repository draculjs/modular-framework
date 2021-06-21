<template>
  <v-menu
      v-model="menu"
      :close-on-content-click="false"
      offset-x
  >
    <template v-slot:activator="{ on }">
      <v-text-field
          v-on="on"
          prepend-icon="palette"
          type="text"
          v-model="colorValue"
          :label="label"
          :placeholder="label"
          class="pa-3"
          :rules="rules"
          :error="hasErrors"
          :error-messages="getMessageErrors"
          :color="color"
      >
        <template v-slot:append>
          <v-chip :color="colorValue" small>
            {{colorValue}}
          </v-chip>
        </template>
      </v-text-field>
    </template>
    <v-color-picker v-model="colorValue" class="ma-2" flat
                    mode="hexa"></v-color-picker>
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
    rules: Array
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

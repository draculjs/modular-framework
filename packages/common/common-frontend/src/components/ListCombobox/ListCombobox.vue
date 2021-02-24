<template>
  <v-combobox
      :name="name"
      :prepend-icon="icon"
      v-model="computedValue"
      :items="items"
      :label="$t(label)"
      multiple
      chips
      color="secondary"
      item-color="secondary"
      :error="error"
      :error-messages="errorMessages"
      :disabled="disabled"
  ></v-combobox>
</template>

<script>
export default {
  name: "ListCombobox",
  props: {
    value: {type: Array},
    icon: {type: String, default: 'loyalty'},
    label: {type: String, default: ''},
    error: {type:Boolean, default: false},
    errorMessages: {type:Array, default: () => []},
    disabled: {type:Boolean, default: false},
    name: {type:String, default:''}

  },
  mounted() {
    this.items = this.value
  },
  data() {
    return {
      items: this.value,
    }
  },
  computed: {
    computedValue: {
      get() {
        return this.value
      },
      set(val) {
        this.items = val
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="auto"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
          v-model="date"
          :label="label"
          prepend-icon="mdi-calendar"
          v-on="on"
          :clearable="clearable"
          :solo="solo"
          :outlined="outlined"
          :disabled="disabled"
          :readonly="readonly"
          :hide-details="hideDetails"
          :style="{width: width, maxWidth: width}"
      ></v-text-field>
    </template>
    <v-date-picker
        v-model="date"
        type="month"
        no-title
        scrollable
        @input="menu = false"
    >
    </v-date-picker>
  </v-menu>
</template>

<script>
import DayjsMixin from "../../mixins/DayjsMixin";

export default {
  name: "MonthPicker",
  mixins: [DayjsMixin],
  props: {
    value: {type: [String, Object]},
    label: {type: String, default: "Mes"},
    solo: {type: Boolean, default: false},
    clearable: {type:Boolean, default: true},
    outlined: {type:Boolean, default: false},
    readonly: {type:Boolean, default: true},
    disabled: {type:Boolean, default: false},
    hideDetails: {type: Boolean, default: false},
    width: {type: String, default: null},
  },
  data() {
    return {
      menu: false
    }
  },
  computed: {
    date: {
      get() {
        return this.getDateFormat(this.value)
      },
      set(val) {
        this.$emit('input', this.convertStringDateToDayjs(val))
      }
    }
  },
}
</script>

<style scoped>

</style>

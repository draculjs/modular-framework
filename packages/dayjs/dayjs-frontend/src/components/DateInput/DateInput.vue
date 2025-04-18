<template>
  <v-menu
      v-model="menu"
      :close-on-content-click="closeOnContentClick"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
          ref="date"
          v-model="item"
          :label="label"
          :prepend-icon="prependIcon"
          :prepend-inner-icon="prependInnerIcon"
          v-on="on"
          :rules="rules"
          :error="error"
          :error-messages="errorMessages"
          :color="color"
          :style="{width: width, maxWidth: width}"
          :clearable="clearable"
          :solo="solo"
          :outlined="outlined"
          :disabled="disabled"
          :readonly="readonly"
          :hide-details="hideDetails"
          :dense="dense"
      >
        <template v-slot:message>
          <slot name="message"></slot>
        </template>
        <template v-slot:prepend-inner>
          <slot name="prepend-inner"></slot>
        </template>
        <template v-slot:prepend>
          <slot name="prepend"></slot>
        </template>
      </v-text-field>
    </template>
    <v-date-picker
        v-model="item"
        scrollable
        @input="menu = false"
        :allowed-dates="allowedDates"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import DayjsMixin from "../../mixins/DayjsMixin";

export default {
  name: "DateInput",
  props: {
    value: {type:[String,Object]},
    closeOnContentClick: {type: Boolean, default: false},
    error: {type: Boolean},
    errorMessages: {type:Array},
    label: { type: String},
    color: { type: String, default: "secondary"},
    prependIcon: { type: String, default: "date_range"},
    prependInnerIcon: { type: String},
    rules: {type: Array, default: ()=>[]},
    clearable: {type:Boolean, default: true},
    outlined: {type:Boolean, default: false},
    dense: {type:Boolean, default: false},
    solo: {type:Boolean, default: false},
    readonly: {type:Boolean, default: true},
    disabled: {type:Boolean, default: false},
    hideDetails: {type: Boolean, default: false},
    width: {type: String, default: null},
    allowedDates: {type: [Object,Function,Array], default: null},
  },
  mixins: [DayjsMixin],
  computed: {
    item: {
      get() {
        return this.getDateFormat(this.value)
      },
      set(val) {
        this.$emit('input', this.convertStringDateToDayjs(val))
      }
    }
  },
  data(){
    return {
      menu: false
    }
  },
  methods:{
    validate(){
      this.$refs.date.validate()
    }
  }

}
</script>

<style scoped>

</style>

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
          prepend-icon="date_range"
          readonly
          v-on="on"
          :rules="rules"
          :error="error"
          :error-messages="errorMessages"
          color="secondary"
          :clearable="clearable"
      ></v-text-field>
    </template>
    <v-date-picker v-model="item" scrollable @input="menu = false">
    </v-date-picker>
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
    rules: {type: Array, default: ()=>[]},
    clearable: {type:Boolean, default: true}
  },
  mixins: [DayjsMixin],
  computed: {
    item: {
      get() {
        return this.getDateFormat(this.value)
      },
      set(val) {this.$emit('input', this.convertStringDateToDayjs(val))}
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

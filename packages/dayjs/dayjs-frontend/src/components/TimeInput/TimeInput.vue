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
          v-on="on"
          :value="item"
          :label="label"
          prepend-icon="query_builder"
          readonly
          :rules="rules"
          :error="error"
          :error-messages="errorMessages"
          color="secondary"
      ></v-text-field>
    </template>
    <v-time-picker :value="item"
                   @input="menu = false">
    </v-time-picker>
  </v-menu>
</template>

<script>
import DayjsMixin from "../../mixins/DayjsMixin";

export default {
  name: "TimeInput",
  props: {
    value: {type:[String,Object]},
    closeOnContentClick: {type: Boolean, default: false},
    error: {type: Boolean},
    errorMessages: {type:Array},
    label: { type: String},
    rules: {type: Array, default: ()=>[]}
  },
  mixins: [DayjsMixin],
  computed: {
    item: {
      get() {
        return this.getTimeFormat(this.value)
      },
      set(val) {this.$emit('input', val)}
    }
  },
  data(){
    return {
      menu: false
    }
  }

}
</script>

<style scoped>

</style>

<template>
  <v-row>
    <v-col cols="12" sm="6">
      <date-input ref="date" :value="item" :rules="dateRules" @input="setDate"
                  :clearable="clearable"
                  :solo="solo"
                  :outlined="outlined"
                  :disabled="disabled"
                  :readonly="readonly"
                  :hide-details="hideDetails"
                  :dense="dense"
      ></date-input>
    </v-col>

    <v-col cols="12" sm="6">
      <time-input ref="time" :value="item" :rules="timeRules" @input="setTime"
                  :format="timeFormat"
                  :clearable="clearable"
                  :solo="solo"
                  :outlined="outlined"
                  :disabled="disabled"
                  :readonly="readonly"
                  :hide-details="hideDetails"
                  :dense="dense"
      ></time-input>
    </v-col>

  </v-row>

</template>

<script>
import DateInput from "../DateInput/DateInput.vue";
import TimeInput from "../TimeInput/TimeInput.vue";
import DayjsMixin from "../../mixins/DayjsMixin.js";
import setDateToDatetimeHelper from "../../helpers/setDateToDatetimeHelper.js";
import setTimeToDatetimeHelper from "../../helpers/setTimeToDatetimeHelper.js";

export default {
  name: "DateTimeInput",
  components: {TimeInput, DateInput},
  props: {
    value: {type: [String, Object]},
    closeOnContentClick: {type: Boolean, default: false},
    error: {type: Boolean},
    errorMessages: {type: Array},
    label: {type: String},
    dateRules: {type: Array, default: () => []},
    timeRules: {type: Array, default: () => []},
    clearable: {type: Boolean, default: true},
    timeFormat: {type: String, default: "24hr"},
    outlined: {type:Boolean, default: false},
    dense: {type:Boolean, default: false},
    solo: {type:Boolean, default: false},
    readonly: {type:Boolean, default: true},
    disabled: {type:Boolean, default: false},
    hideDetails: {type: Boolean, default: false},
  },
  mixins: [DayjsMixin],
  computed: {
    item: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', this.convertStringDateToDayjs(val))
      }
    }
  },
  methods: {
    setDate(val) {
      this.$emit('input', setDateToDatetimeHelper(this.item, val))
    },
    setTime(val) {
      this.$emit('input', setTimeToDatetimeHelper(this.item, val))
    },
    validate() {
      this.$refs.date.validate()
      this.$refs.time.validate()
    }
  },
  data() {
    return {
      menu: false
    }
  }

}
</script>

<style scoped>

</style>

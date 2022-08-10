<template>
  <v-row>
    <v-col cols="12" sm="6">
      <date-input ref="date" :value="item" :rules="dateRules" @input="setDate" :clearable="clearable"></date-input>
    </v-col>

    <v-col cols="12" sm="6">
      <time-input ref="time" :value="item" :rules="timeRules" @input="setTime" :clearable="clearable" :format="timeFormat"></time-input>
    </v-col>

  </v-row>

</template>

<script>
import DateInput from "../DateInput/DateInput";
import TimeInput from "../TimeInput/TimeInput";
import DayjsMixin from "../../mixins/DayjsMixin";
import setDateToDatetimeHelper from "../../helpers/setDateToDatetimeHelper";
import setTimeToDatetimeHelper from "../../helpers/setTimeToDatetimeHelper";

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
    timeFormat: {type: String, default: "24hr"}
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

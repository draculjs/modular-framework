<template>
  <v-row>
    <v-col cols="12" sm="6">
      <date-input :value="item" @input="setDate"></date-input>
    </v-col>

    <v-col cols="12" sm="6">
      <time-input :value="item" @input="setTime" ></time-input>
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
    value: {type: String},
    closeOnContentClick: {type: Boolean, default: false},
    error: {type: Boolean},
    errorMessages: {type: Array},
    label: {type: String}
  },
  mixins: [DayjsMixin],
  computed: {
    item: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods:{
    setDate(val){
      this.$emit('input', setDateToDatetimeHelper(this.item,val))
    },
    setTime(val){
      this.$emit('input', setTimeToDatetimeHelper(this.item,val))
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

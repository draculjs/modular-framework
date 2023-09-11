<template>
  <v-row dense>

    <v-col cols="12">
      <label>{{ label }}</label>
    </v-col>

    <v-col cols="12" v-for="(item,index) in items" :key="index" class="text-right">
      <v-row dense align="center">
        <v-col cols="11">
          <slot name="default" v-bind="{ item, index}">
          </slot>
        </v-col>
        <v-col cols="1">
          <v-btn v-if="!readonly" icon @click="removeItem(index)" small class="red--text text--darken-3">
            <v-icon>close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

    </v-col>
    <v-btn v-if="!readonly" icon @click="addItem">
      <v-icon>add</v-icon>
    </v-btn>

    <snackbar v-model="snackbarMessage"  color="error"></snackbar>
  </v-row>
</template>

<script>
import Snackbar from "../Snackbar";
export default {
  name: "FormList",
  components: {Snackbar},
  props: {
    value: {type: Array, required: true},
    label: {type: String},
    icon: {type: String},
    newItem: {type: [String, Object], required: true},
    minLength: {type: Number},
    maxLength: {type: Number},
    readonly: {type: Boolean, default:false}
  },
  data(){
    return {
      snackbarMessage: null
    }
  },
  computed: {
    items: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  created(){
    this.addMinItems()
  },
  watch: {
    minLength() {this.addMinItems()},
  },
  methods: {
    addMinItems(){
      if(this.minLength >= 1 && this.items.length < this.minLength ){
        for(let i=0 ; i < (this.minLength - this.items.length); i++){
          this.addItem()
        }
      }
    },
    updateItem(val, index) {
      this.$set(this.items, index, val)
    },
    addItem() {
      if(this.maxLength > 1 && this.items.length >= this.maxLength ){
        this.snackbarMessage = this.$t('error.LIST_MAX_REACHED')
        return
      }
      this.items.push(this.newItem)
    },
    removeItem(index) {
      if(this.minLength >= 1 && this.items.length == this.minLength  ){
        this.snackbarMessage = this.$t('error.LIST_MIN_REACHED')
        return
      }
      this.items.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>

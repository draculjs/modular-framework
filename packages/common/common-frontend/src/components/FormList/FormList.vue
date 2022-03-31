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
          <v-btn icon @click="removeItem(index)" small class="red--text text--darken-3">
            <v-icon>close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

    </v-col>
    <v-btn icon @click="addItem">
      <v-icon>add</v-icon>
    </v-btn>

  </v-row>
</template>

<script>
export default {
  name: "FormList",
  props: {
    value: {type: Array, required: true},
    label: {type: String},
    icon: {type: String},
    newItem: {type: [String, Object], required: true}
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
  methods: {
    updateItem(val, index) {
      this.$set(this.items, index, val)
    },
    addItem() {
      this.items.push(this.newItem)
    },
    removeItem(index) {
      this.items.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>

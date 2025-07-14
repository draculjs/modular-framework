<template>
  <v-text-field
      v-model="search"
      :prepend-inner-icon="prependInnerIcon"
      :label="$t(label)"
      single-line
      hide-details
      v-on:keyup.native.enter="$emit('search')"
      :clearable="clearable" @click:clear="onClear"
  ></v-text-field>
</template>

<script>
export default {
  name: "SearchInput",
  props: {
    value: {type: String, default: ''},
    label: {type: String, default: 'common.search'},
    clearable: {type: Boolean, default: true},
    prependInnerIcon: {type: String, default: 'mdi-magnify'},

  },
  computed: {
    search: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods:{
    onClear(){
      setTimeout(() => {
        this.$emit("search")
      },10)
    }
  }
}
</script>

<style scoped>

</style>

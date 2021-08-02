<template>
  <v-select
      prepend-icon="language"
      class="pa-3"
      :items="langs"
      :item-text="'text'"
      :item-value="'value'"
      color="secondary"
      item-color="secondary"
      v-model="formLang.language"
      :label="$t('customization.lang.form.lang')"
      required
  ></v-select>
</template>

<script>
export default {
  name: "LanguageCombobox",
  props: {
    value: String,
    langs: {type: Array},
  },
  computed: {
    localValue: {
      get(){
        return this.value
      },
      set(val){
        this.$emit('input',val)
      }
    }
  }
}
</script>

<style scoped>

</style>

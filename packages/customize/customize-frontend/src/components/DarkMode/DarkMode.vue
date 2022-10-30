<template>
  <v-switch
      :label="getLabel"
      :dense="dense"
      v-model="dark"
      :color="color"
      hide-details
  ></v-switch>
</template>

<script>
export default {
  name: "DarkMode",
  props: {
    label: {type: String, default: 'customization.darkMode'},
    color: {type: String, default: 'green'},
    dense: {type: Boolean, default: true},

  },
  computed: {
    dark: {
      get() {
        return this.$vuetify.theme.dark
      },
      set(val) {
        this.$store.commit('darkMode', val)
        this.$vuetify.theme.dark = val
      }
    },
    getLabel() {
      return this.$te(this.label) ? this.$t(this.label) : this.label
    }
  }
}
</script>

<style scoped>

</style>

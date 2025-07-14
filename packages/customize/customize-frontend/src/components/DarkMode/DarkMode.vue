<template>
  <v-tooltip bottom>
    <template v-slot:activator="{on, attrs}">
      <div v-on="on"
           v-bind="attrs"
      >
        <v-switch
            :dense="dense"
            v-model="dark"
            :color="color"
            hide-details
            :prepend-icon="showIcon ? icon : null"
            :label="showLabel ? getLabel : null"
        ></v-switch>

      </div>
    </template>
    <span>{{ getLabel }}</span>
  </v-tooltip>

</template>

<script>
export default {
  name: "DarkMode",
  props: {
    label: {type: String, default: 'customization.darkMode'},
    color: {type: String, default: 'green'},
    dense: {type: Boolean, default: true},
    icon: {type: String, default: 'mdi-dark_mode'},
    showIcon:  {type: Boolean, default: true},
    showLabel:  {type: Boolean, default: false},
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

<template>
  <v-icon
      small
      :color="color"
      class="mx-1"
      v-on="$listeners"
  >
    {{ icon }}
  </v-icon>
</template>

<script>
export default {
  name: "ShowButton",
  props: {
    color: {type: String, default: 'primary onPrimary--text'},
    small: {type: Boolean, default: true},
    icon: {type:String, default: 'mdi-magnify'}
  }
}
</script>

<style scoped>

</style>

<template>
  <v-icon
      small
      color="primary"
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
    icon: {type:String, default: 'search'}
  }
}
</script>

<style scoped>

</style>

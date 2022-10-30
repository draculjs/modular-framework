<template>
  <v-icon
      :small="small"
      :color="color"
      class="mx-1"
      v-on="$listeners"
  >
    {{ icon }}
  </v-icon>
</template>

<script>
export default {
  name: "DeleteButton",
  props: {
    color: {type: String, default: 'red white--text'},
    small: {type: Boolean, default: true},
    icon: {type: String, default: 'delete'}
  }
}
</script>

<style scoped>

</style>

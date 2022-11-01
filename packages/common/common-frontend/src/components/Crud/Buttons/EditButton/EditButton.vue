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
  name: "EditButton",
  props: {
    color: {type: String, default: 'primary onPrimary--text'},
    small: {type: Boolean, default: true},
    icon: {type:String, default: 'edit'}
  }
}
</script>

<style scoped>

</style>

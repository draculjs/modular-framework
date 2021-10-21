<template>
  <v-card :to="to">
    <v-card-title class="primary--text">{{title}}</v-card-title>
    <v-card-subtitle>{{subtitle}}</v-card-subtitle>
    <v-card-text>
      <v-icon class="primary--text" size="100">{{icon}}</v-icon>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "HomeCard",
  props: {
    title: String,
    subtitle: String,
    icon: String,
    to: Object
  }
}
</script>

<style scoped>

</style>

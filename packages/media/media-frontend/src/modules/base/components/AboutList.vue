<template>
  <v-card
      class="mx-auto"
      max-width="400"
      tile
  >
    <v-list-item v-for="(item, index) in items" :key="index">
      <v-list-item-content>
        <v-list-item-title class="body-1">{{item.title}}</v-list-item-title>
        <v-list-item-content class="body-2">{{item.subtitle}}</v-list-item-content>
        <v-list-item-subtitle><a :href="item.link" target="_blank">Ver mas</a></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>
<script>
export default {
  name: "AboutList",
  props:{
    items: {type: Array, default: null},
  }
}
</script>
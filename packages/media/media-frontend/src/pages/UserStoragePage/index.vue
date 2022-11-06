<template>
  <v-container fluid>
    <user-storage-crud></user-storage-crud>
  </v-container>
</template>

<script>
import UserStorageCrud from "./UserStorage.vue";

export default {
  name: "UserStorage",
  components: {UserStorageCrud},

}
</script>

<style scoped>

</style>


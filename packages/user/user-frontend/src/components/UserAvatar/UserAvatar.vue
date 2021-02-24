<template>
  <v-avatar
      :size="avatarSize"
      color="grey lighten-4"

  >
    <img v-if="user.avatarurl" :src="user.avatarurl"
         style="position: absolute"
    />
    <img v-else
         style="position: absolute"
         :src="src"
    />
  </v-avatar>
</template>

<script>
export default {
  name: "UserAvatar",
  props: {
    user: {type: Object}
  },
  data: () => ({
    avatarSize: 120,
    src: require("../../assets/user.png")
  }),
}
</script>

<style scoped>

</style>

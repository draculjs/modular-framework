<template>

  <v-avatar
      :tile="tile"
      :size="avatarSize"
      color="grey lighten-4"
      slot="activator"
      v-on:mouseover="hover = true"
      v-on:mouseleave="hover = false"

  >
    <img v-if="userAvatarUrl" :src="userAvatarUrl"
         style="position: absolute"
    />
    <img v-else
         style="position: absolute"
         :src="src"
    />

    <img v-if="userAvatarUrl"
         v-show="hover || loading"
         style="position: absolute"
         :src="userAvatarUrl"
    />

    <img v-else
         v-show="hover || loading"
         style="position: absolute"
         :src="src"
    />

    <v-progress-circular
        v-if="loading"
        :size="50"
        color="primary"
        indeterminate
    />

    <v-col v-else
           v-show="hover"
           style="position: relative; cursor:pointer;"
           class="grey--text"
    >
      <v-icon class="grey--text">photo_camera</v-icon>
      <br>
      <span class="font-weight-bold">Cambiar Foto</span>
    </v-col>
  </v-avatar>


</template>

<script>


export default {
  name: "UserAvatarImg",
  props: {
    loading: {type: Boolean, default: Boolean},
    userAvatarUrl: {type: String}
  },
  data: () => ({
    avatarSize: 120,
    tile: false,
    hover: false,
    src: require("../../../../assets/user.png")
  }),

}
</script>

<style scoped>

</style>

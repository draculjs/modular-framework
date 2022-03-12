<template>
  <v-container fill-height>
    <gallery-menu :nav="menu"> </gallery-menu>
  </v-container>
</template>

<script>
import menuConfig from "@/menu-config/menu-config"
import GalleryMenu from "@/layout/GalleryMenu/GalleryMenu";

export default {
  name: 'HomePage',
  components: {GalleryMenu},
  computed: {
    menu() {
      return menuConfig
    }
  }
}
</script>

<style scoped>

</style>

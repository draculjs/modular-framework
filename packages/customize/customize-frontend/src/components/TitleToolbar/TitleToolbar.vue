<template>

  <router-link to="/" class="text-decoration-none">
    <v-toolbar-title class="ml-2" :class="color">
      <b>{{ getLogo.title }}</b>
    </v-toolbar-title>
  </router-link>

</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "TitleToolbar",
  props: {
    color: {type: String, default: 'onAppBar--text'}
  },
  computed: {
    ...mapGetters(['getLogo'])
  }
}
</script>

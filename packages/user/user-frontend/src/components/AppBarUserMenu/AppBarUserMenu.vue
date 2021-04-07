<template>

  <v-menu v-if="isAuth && me" offset-y left>
    <template v-slot:activator="{on}">
      <v-toolbar-items>
        <v-btn icon large v-on="on">
          <v-avatar
              :tile="tile"
              :size="avatarSize"
              color="grey lighten-4"
          >
            <img v-if="getAvatarUrl" :src="getAvatarUrl"/>
            <img v-else src="@/assets/user.png">
          </v-avatar>
        </v-btn>
      </v-toolbar-items>
    </template>

    <v-list subheader>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ getUsername }}</v-list-item-title>
          <v-list-item-subtitle>{{ getEmail }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item :to="{name: 'me'}">
        <v-list-item-title v-t="'auth.profile'"></v-list-item-title>
      </v-list-item>

      <v-list-item @click="doLogout">
        <v-list-item-title v-t="'auth.logout'"></v-list-item-title>
      </v-list-item>

    </v-list>


  </v-menu>

  <v-btn v-else
         text
         color="primary"
         class="onPrimary--text"
         :to="{name: 'login'}"
         rounded
         v-t="'auth.signIn'"
  />

</template>

<script>

import {mapGetters, mapActions} from 'vuex'

export default {
  name: "AppBarUserMenu",
  data: () => ({
    src: '@/assets/user.png',
    avatarSize: 45,
    tile: false
  }),
  methods: {
    ...mapActions([
      'logout',
    ]),
    doLogout() {
      this.logout()
      this.$router.push({name: 'login'})
    },
  },
  computed: {
    ...mapGetters(['isAuth', 'me', 'getAvatarUrl']),
    getUsername: function () {
      if (this.me && this.me.username) {
        return this.me.username
      }
      return null
    },
    getEmail: function () {
      if (this.me && this.me.email) {
        return this.me.email
      }
      return null
    },
  }
}
</script>

<style scoped>

</style>

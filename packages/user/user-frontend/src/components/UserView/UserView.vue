<template>
  <v-list-item >
    <template v-if="getUser">
      <v-list-item-avatar>
        <img v-if="getUser.avatarurl" :src="getUser.avatarurl"/>
        <img v-else :src="getDefaultAvatar"/>

      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-html="getUser.username"></v-list-item-title>
        <v-list-item-subtitle v-html="getUser.name"></v-list-item-subtitle>
      </v-list-item-content>

    </template>

    <loading v-else-if="loading" ></loading>

  </v-list-item>
</template>

<script>
import userProvider from "../../providers/UserProvider";
import {Loading} from '@dracul/common-frontend'
export default {
  name: "UserView",
  components: {Loading},
  props: {
    id: {type: String},
    user: {type: Object}
  },
  computed: {
    getUser() {
      if (this.user) {
        return this.user
      } else if (this.localUser) {
        return this.localUser
      }
      return null
    },
    getDefaultAvatar() {
      return this.defaultAvatar ? this.defaultAvatar : require("../../assets/user.png")
    },
  },
  data() {
    return {
      localUser: null,
      loading: false
    }
  },
  mounted() {
    if (!this.user && this.id) {
      this.findUser()
    }
  },
  methods: {
    findUser() {
      this.loading = true
      userProvider.user(this.id)
          .then(r => {
            this.localUser = r.data.user
          })
          .catch(e => console.log(e))
          .finally(() => this.loading = false)
    }
  }
}
</script>

<style scoped>

</style>

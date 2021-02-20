<template>

  <crud-show :open="open"
             title="user.changeAvatarTitle"
             @close="$emit('close')"
  >
  <div class="text-center">
    <user-avatar-form :user="user" v-slot="i" @avatarUpdate="onAvatarUpdate">
      <user-avatar-img :loading="i.loading" :userAvatarUrl="userAvatarUrl" />
    </user-avatar-form>

  </div>

  </crud-show>

</template>

<script>

import {CrudShow} from '@dracul/common-frontend'
import UserAvatarForm from "./UserAvatar/UserAvatarForm";
import UserAvatarImg from "./UserAvatar/UserAvatarImg";

export default {
  name: "AdminChangePassword",
  components: {UserAvatarImg, UserAvatarForm, CrudShow},
  props: {
    user: Object,
    open: Boolean
  },
  data(){
    return {
      userAvatarUrl: this.user.avatarurl
    }
  },
  methods: {
    onAvatarUpdate(avatarUrl) {
      this.userAvatarUrl = avatarUrl
      this.$emit("changeAvatarConfirmed")
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <show-field :value="sharedWith" :label="$t('media.file.users')" icon="person" />
</template>

<script>
import { userProvider } from "@dracul/user-frontend"
import { ShowField } from '@dracul/common-frontend'

export default {
  name: "UsersShow",
  components: { ShowField },
  props: {
    fileIdUsers: { type: Array },
  },
  data() {
    return {
      fileUsers: [],
      sharedWith: '-'
    }
  },
  mounted() {
    userProvider.users().then((result) => {
      this.fileUsers = result.data.users.filter((user) => this.fileIdUsers.includes(user.id))

      if(this.fileUsers.length > 1){
        this.sharedWith = this.fileUsers.reduce((a, b) => `${a.name}, ${b.name}`)
      }else if (this.fileUsers.length == 1){
        this.sharedWith = this.fileUsers[0].name
      }
    })
  },
}
</script>

<style scoped>
</style>

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
      sharedWith: ''
    }
  },
  mounted() {
    userProvider.users().then((result) => {
      this.fileUsers = result.data.users.filter((user) => this.fileIdUsers.includes(user.id))

      if(this.fileUsers.length > 1){
        
        for (let userCounter = 0; userCounter < this.fileUsers.length; userCounter++) {
          if (userCounter == 0){
            this.sharedWith += `${this.fileUsers[userCounter].name}`
          }else{
            this.sharedWith += `, ${this.fileUsers[userCounter].name}`
          }
        }
        
      }else if (this.fileUsers.length == 1){
        this.sharedWith = this.fileUsers[0].name
      }else{
        this.sharedWith = '-'
      }
    })
  },
}
</script>

<style scoped>
</style>

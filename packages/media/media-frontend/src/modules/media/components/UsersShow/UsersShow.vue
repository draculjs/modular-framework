<template>
  <show-field :value="stringUsers" :label="$t('media.file.users')" icon="person" />
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
      stringUsers: ''
    }
  },
  mounted() {
    userProvider.users().then((result) => {
      this.fileUsers = result.data.users.filter((user) => this.fileIdUsers.includes(user.id))
      this.stringUsers = this.fileUsers.length > 0 ? this.fileUsers.reduce((a, b) => (a.name || a) + ", " + b.name) : "-"
    })
  },
}
</script>

<style scoped>
</style>

<template>
  <show-field :value="stringGroups" :label="$t('media.file.groups')" icon="group" />
</template>

<script>
import { groupProvider } from "@dracul/user-frontend"
import { ShowField } from '@dracul/common-frontend'

export default {
  name: "GroupsShow",
  components: { ShowField },
  props: {
    fileIdGroups: { type: Array }
  },
  data() {
    return {
      fileGroups: [],
      stringGroups: ''
    }
  },
  mounted() {
    groupProvider.groups().then((result) => {
      this.fileGroups = result.data.groups.filter((group) => this.fileIdGroups.includes(group.id))
      this.stringGroups = this.fileGroups.length > 0 ? this.fileGroups.reduce((a, b) => (a.name || a) + ", " + b.name) : "-"
    })
  }
}
</script>

<style scoped>
</style>

<template>
  <show-chip-field :chips="fileGroups" :label="$t('media.file.groups')" icon="groups"/>
</template>

<script>
import { groupProvider } from "@dracul/user-frontend"
import { ShowChipField } from '@dracul/common-frontend'

export default {
  name: "GroupsShow",
  props: {
    fileIdGroups: { type: Array },
  },
  components: { ShowChipField },
  data() {
    return {
      fileGroups: [],
      sharedWith: ''
    }
  },
  mounted() {
    groupProvider.groups().then((result) => {
      if(!this.fileIdGroups) return;
      this.fileGroups = result.data.groups.filter((group) => this.fileIdGroups.includes(group.id))

      if(this.fileGroups.length > 1){

        for (let groupsCounter = 0; groupsCounter < this.fileGroups.length; groupsCounter++) {
          if (groupsCounter == 0){
            this.sharedWith += `${this.fileGroups[groupsCounter].name}`
          }else{
            this.sharedWith += `, ${this.fileGroups[groupsCounter].name}`
          }
        }

      }else if (this.fileGroups.length == 1){
        this.sharedWith = this.fileGroups[0].name
      }else{
        this.sharedWith = '-'
      }
    })
  }
}
</script>

<style scoped>
</style>

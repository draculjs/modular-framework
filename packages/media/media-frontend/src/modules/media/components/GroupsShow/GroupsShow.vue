<template>
  <v-list-item>
    <v-list-item-icon class="mr-5">
      <v-icon color="primary" class="mt-2">groups</v-icon>
    </v-list-item-icon>

    <v-list-item-content class="mr-0">
      <v-chip-group column>
        <v-chip v-for="group in fileGroups" 
          :key="group.id" 
          color="primary lighten-2" 
          text-color="white"
          label
          small
        >
          {{ group.name }}
        </v-chip>
      </v-chip-group>
      <v-list-item-subtitle>{{$t('media.file.groups')}}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { groupProvider } from "@dracul/user-frontend"

export default {
  name: "GroupsShow",
  props: {
    fileIdGroups: { type: Array },
  },
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

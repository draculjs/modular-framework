<template>
  <v-container fill-height>
    <v-row justify="center" align="center">

      <v-col v-if="$store.getters.me" cols="12" sm="4" class="text-center">
        <home-card
            title="File Management"
            icon="file_present"
            :to="{name:'FileManagementPage'}"
        />
      </v-col>

      <v-col v-if="$store.getters.hasPermission('FILE_SHOW_ALL')" cols="12" sm="4" class="text-center">
        <home-card
            title="File Dashboard"
            icon="dashboard"
            :to="{name:'FileDashboardPage'}"
        />
      </v-col>

      <v-col v-if="$store.getters.hasPermission('FILE_SHOW_ALL')" cols="12" sm="4" class="text-center">
        <home-card
            title="User Storage Config"
            icon="settings"
            :to="{name:'UserStoragePage'}"
        />
      </v-col>

      <v-col cols="12" sm="4" class="text-center">
        <home-card
            title="Docs"
            icon="description"
            :to="{name:'DocsPage'}"
        />
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import {HomeCard} from '../../components/HomeCard'
export default {
  name: 'HomePage',
  components: {HomeCard}
}
</script>

<style scoped>

</style>

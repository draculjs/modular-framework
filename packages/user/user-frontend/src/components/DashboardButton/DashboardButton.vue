<template>
  <v-btn v-if="mustShow"
         icon
         :color="color"
         :to="{name:'userDashboard'}"
  >
    <v-icon>mdi-security</v-icon>
  </v-btn>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "DashboardButton",
  props: {
    color: {type: String, default: 'onAppBar'}
  },
  computed: {
    ...mapGetters(['isAuth', 'hasPermission']),
    mustShow() {
      return this.hasPermission('SECURITY_DASHBOARD_SHOW')
    }
  }
}
</script>

<style scoped>

</style>

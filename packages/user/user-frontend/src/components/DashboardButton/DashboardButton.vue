<template>
  <v-btn v-if="mustShow"
         icon
         :to="{name:'userDashboard'}"
         class="onPrimary--text"
  >
    <v-icon>security</v-icon>
  </v-btn>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "DashboardButton",
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

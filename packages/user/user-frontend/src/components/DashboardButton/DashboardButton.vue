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
            ...mapGetters(['isAuth', 'hasRole']),
            mustShow() {
                return this.hasRole('admin')
            }
        }
    }
</script>

<style scoped>

</style>

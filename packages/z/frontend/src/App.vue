<template>
    <layout :menu="menu">
      <template v-slot:toolbar-left>
        <logo-toolbar></logo-toolbar>
        <title-toolbar></title-toolbar>
      </template>

      <template v-slot:toolbar-right>
        <notification-button v-if="me" :user-id="getUserId"/>
        <dashboard-button/>
        <app-bar-user-menu/>
      </template>


      <router-view></router-view>
      <error-snackbar></error-snackbar>
    </layout>
</template>

<script>
import {NotificationButton} from "@dracul/notification-frontend"
import Layout from "./layout/Layout";
import menuConfig from './menu-config'
import {DashboardButton, AppBarUserMenu} from '@dracul/user-frontend'
import {LogoToolbar, TitleToolbar} from '@dracul/customize-frontend'
import {mapGetters} from "vuex";
import ErrorSnackbar from "@/modules/base/components/ErrorSnackbar";

export default {
  name: 'App',
  components: {ErrorSnackbar, Layout, DashboardButton, AppBarUserMenu, LogoToolbar, TitleToolbar, NotificationButton},
  data() {
    return {
      menu: menuConfig
    }
  },
  mounted() {
    this.$store.dispatch('checkAuth')
  },
  watch: {
    '$store.state.user.access_token': {
      handler(val) {
        if (val === null && (this.$route.name != 'login' && this.$route.name != 'recovery')) {
          this.$router.push({name: 'login'})
        }
      }
    }
  },
  computed: {
    ...mapGetters(['me']),
    getUserId() {
      return this.me ? this.me.id : null
    }
  }
};
</script>

<template>
    <v-app>
        <layout :menu="menu">
            <template v-slot:toolbar-left>
                <logo-toolbar></logo-toolbar>
                <title-toolbar></title-toolbar>
            </template>

            <template v-slot:toolbar-right>
                <dashboard-button />
                <app-bar-user-menu />
            </template>


            <router-view></router-view>
        </layout>
    </v-app>
</template>

<script>

    import Layout from "./layout/Layout";
    import menuConfig from './menu-config'
    import {DashboardButton, AppBarUserMenu} from '@dracul/user-frontend'
    import {LogoToolbar,TitleToolbar} from '@dracul/customize-frontend'

    export default {
        name: 'App',
        components: {Layout,DashboardButton,AppBarUserMenu,LogoToolbar,TitleToolbar},
        data(){
            return {
                menu: menuConfig
            }
        },
        mounted() {
            this.$store.dispatch('checkAuth')
        }
    };
</script>

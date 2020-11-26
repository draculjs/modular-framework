<template>
  <div id="app">
      <v-toolbar color="secondary" dark>
      <v-spacer></v-spacer>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            color="grey"
            v-bind="attrs"
            v-on="on"
            v-on:click="markAllRead"
          >
            mdi-email-open
          </v-icon>
        </template>
        <span>{{ this.$t("notification.markAllRead") }}</span>
      </v-tooltip>
    </v-toolbar>
    <v-app id="inspire">
      <v-data-table
        :headers="headers"
        :items="items"
        dense
        flat
        :loading="loading"
        :server-items-length="totalItems"
        :items-per-page.sync="limit"
        :page.sync="page"
        disable-sort
        :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50] }"
        @update:page="getAndUpdateNotifications"
        @update:items-per-page="getAndUpdateNotifications"
        class="elevation-1"
      >
        <template v-slot:item.content="{ item }">
          <notificationShowListContent :item="item" />
        </template>
      </v-data-table>
    </v-app>
    <Snackbar
      v-model="snackbarMessage"
      :color="snackbarColor"
      :timeout="snackbarTimeOut"
      v-on:closeSnackbar="snackbarMessage = null"
    />
  </div>
</template>
<script>
import notificationProvider from "../../../providers/notificationProvider";
import Snackbar from "@dracul/common-frontend/src/components/Snackbar/Snackbar";
import notificationShowListContent from "../NotificationshowListContent/NotificationShowListContent";
import moment from "moment-timezone";
import {mapState} from "vuex";

export default {
  components: {
    Snackbar,
    notificationShowListContent,
  },
  mounted() {
    this.getAndUpdateNotifications();
    moment.locale(this.$t("notification.moment"));
  },
  data() {
    return {
      headers: [{ text: this.$t('notification.content'), value: "content" }],
      page: 1,
      limit: 5,
      totalItems: 0,
      type: null,
      isRead: null,
      loading: false,
      items: [],
      snackbarMessage: null,
      snackbarColor: "",
      snackbarTimeOut: 3000,
    };
  },
  methods: {
    pollData() {
      setInterval(() => {
        this.getAndUpdateNotifications();
      }, this.timePolling);
    },
    getAndUpdateNotifications() {
      if(this.activateWebSocket){
        this.subscribeNotification()
      }
      else{
        this.getNotificationsForPolling()
        this.pollData()
      }
    },
    subscribeNotification(){
      notificationProvider.subscriptionNotification(this.me.id).subscribe(res => {
        this.items.push(res.data.notification)
      })
    },
    getNotificationsForPolling() {
      this.loading = true;
      notificationProvider
          .notificationsPaginateFilter(
              this.limit,
              this.page,
              this.isRead,
              this.type
          )
          .then((response) => {
            let data = response.data.notificationsPaginateFilter;
            this.items = data.items;
            this.totalItems = data.totalItems;
            this.page = data.page;
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
            this.snackbarColor = "error";
            this.snackbarMessage = this.$t(
                "notification.errorLoadingNotifications"
            );
            console.log("Error: ", err);
          });
    },
     markAllRead() {
      notificationProvider
        .markAllReadOrNotRead(false)
        .then((res) => {
          if (res) {
            this.getNotifications();
          }
        })
        .catch((err) => {
          this.snackbarColor = "error";
          this.snackbarMessage = this.$t("notification.errorNotifications");
          console.log("Error al marcar los correos como leidos, error: ", err);
        });
    },
  },
  computed: {
    activateWebSocket(){
      return process.env.VUE_APP_ACTIVATE_WEB_SOCKET
    },
    timePolling(){
      return process.env.VUE_APP_TIME_POLLING
    },
    getOrderBy() {
      return Array.isArray(this.orderBy) ? this.orderBy[0] : this.orderBy;
    },
    getOrderDesc() {
      return Array.isArray(this.orderDesc) ? this.orderDesc[0] : this.orderDesc;
    },
  },
};
</script>

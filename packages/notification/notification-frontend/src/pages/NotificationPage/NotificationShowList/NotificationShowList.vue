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
import {mapGetters} from "vuex";

export default {
  components: {
    Snackbar,
    notificationShowListContent,
  },
  mounted() {
    this.getAndUpdateNotifications();
    this.pullData();
   // this.subscribeNotification()
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
    pullData() {
      setInterval(() => {
        this.getAndUpdateNotifications();
      }, 3000);
    },
    getAndUpdateNotifications() {
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
          this.loadin = false;
          this.snackbarColor = "error";
          this.snackbarMessage = this.$t(
            "notification.errorLoadingNotifications"
          );
          console.log("Error: ", err);
        });
    },
    subscribeNotification(){
      //TODO: Ajustar a esta UI la subscripcion a notificaciones por websocket
      notificationProvider.subscriptionNotification(this.me.id).subscribe(res => {
        this.items.push(res.data.notification)
      })
    },
    getNotifications() {
      this.loading = true;
      notificationProvider
        .fetchNotifications(this.limit, this.isRead, this.type)
        .then((res) => {
          this.items = res.data.fetchNotifications;
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
    ...mapGetters(['me']),
    getOrderBy() {
      return Array.isArray(this.orderBy) ? this.orderBy[0] : this.orderBy;
    },
    getOrderDesc() {
      return Array.isArray(this.orderDesc) ? this.orderDesc[0] : this.orderDesc;
    },
  },
};
</script>

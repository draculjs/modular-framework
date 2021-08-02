<template>
  <v-menu offset-y left open-on-hover :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <v-badge
          :content="totalNotifications"
          :value="totalNotifications"
          color="secondary"
          overlap
      >
        <v-btn v-on="on"
               v-bind="attrs"
               icon
               class="onPrimary--text"
        >
          <v-icon >notifications</v-icon>
        </v-btn>
      </v-badge>
    </template>
    <notificationMiniShow :notificationsItems="getNotificationsWithoutRead"
                          v-on:updateNotifications="getNotifications"/>
  </v-menu>
</template>

<script>
import notificationMiniShow from "../NotificationButtonMiniShow";
import notificationProvider from "../../providers/notificationProvider";

export default {
  components: {notificationMiniShow},

  props: {
    userId: String,
    colorIcon: {type: String, default: 'onPrimary--text'},
  },
  data() {
    return {
      items: [],
      limit: 0,
      type: null,
      isRead: false,
      loading: false
    }
  },
  mounted() {
    this.getNotifications()
  },
  methods: {
    getNotifications() {
      if (this.isWebSocketEnable) {
        this.fetchNotifications()
        this.subscribeNotification()
      } else {
        this.fetchNotifications()
        this.pollData()
      }
    },
    pollData() {
      setInterval(() => {
        this.fetchNotifications()
      }, this.timePolling)
    },
    fetchNotifications() {
      this.loading = true
      notificationProvider.fetchNotifications(this.limit, this.isRead, this.type)
          .then(res => {
            this.items = res.data.fetchNotifications
          })
          .catch(err => {
            console.log('Error: ', err)
          })
          .finally(() => this.loading = false)
    },
    subscribeNotification() {
      if (!this.userId) {
        console.error("NotificationButton: imposible subscribe, userId prop is missing")
        return
      }
      notificationProvider.subscriptionNotification(this.userId).subscribe(res => {
        if(res.data.notification){
          this.items.unshift(res.data.notification)
          this.fetchNotifications();
        }
      })
    }
  },
  computed: {
    isWebSocketEnable() {
      return process.env.VUE_APP_ACTIVATE_WEB_SOCKET ? process.env.VUE_APP_ACTIVATE_WEB_SOCKET : true
    },
    timePolling() {
      return process.env.VUE_APP_TIME_POLLING ? parseInt(process.env.VUE_APP_TIME_POLLING) : 30000
    },
    totalNotifications() {
      return this.getNotificationsWithoutRead.length
    },
    getNotificationsWithoutRead() {
      return this.items.filter(item => item && !item.read);
    },
  }
};
</script>

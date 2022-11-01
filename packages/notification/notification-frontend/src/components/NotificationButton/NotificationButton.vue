<template>
  <v-menu
      left :nudge-bottom="40"
      open-on-hover
      :close-on-content-click="false"
      :nudge-width="280"

  >
    <template v-slot:activator="{ on, attrs }">
      <v-badge
          :content="totalNotifications"
          :value="totalNotifications"
          :color="badgeColor"
          overlap
      >
        <v-btn v-on="on"
               v-bind="attrs"
               icon text
               :color="color"
        >
          <v-icon>notifications</v-icon>
        </v-btn>
      </v-badge>
    </template>
    <notificationMiniShow
        :notificationsItems="getNotificationsWithoutRead"
        v-on:updateNotifications="getNotifications"
    />
  </v-menu>
</template>

<script>
import notificationMiniShow from "../NotificationButtonMiniShow";
import notificationProvider from "../../providers/notificationProvider";

export default {
  components: {notificationMiniShow},

  props: {
    userId: String,
    color: {type: String, default: 'onAppBar'},
    badgeColor: {type: String, default: 'red'},
    colorIcon: {type: String, default: 'onPrimary--text'},
  },
  data() {
    return {
      items: [],
      limit: 0,
      type: null,
      isRead: false,
      loading: false,
      interval: null,
      notificationMethod: null
    }
  },
  mounted() {
    this.fetchNotificationMethod()
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    fetchNotificationMethod() {
      notificationProvider.fetchNotificationMethod()
          .then((res) => {
            this.notificationMethod = res.data.fetchNotificationMethod
            this.getNotifications()
          }).catch(() => {
        setTimeout(this.fetchNotificationMethod, 30000)
      })
    },
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
      this.interval = setInterval(() => {
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
        if (res.data.notification) {
          this.items.unshift(res.data.notification)
          this.fetchNotifications();
        }
      })
    }
  },
  computed: {
    isWebSocketEnable() {
      return this.notificationMethod.enableWs ? this.notificationMethod.enableWs : false
    },
    timePolling() {
      return this.notificationMethod.timePolling ? this.notificationMethod.timePolling : 30000
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

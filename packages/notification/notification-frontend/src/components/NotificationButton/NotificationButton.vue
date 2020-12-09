<template>
  <div class="text-center">
    <v-menu offset-y left open-on-hover :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-badge
            :content="totalNotifications"
            :value="totalNotifications"
            color="secondary"
            overlap
        >
          <v-icon v-bind="attrs" v-on="on" :color="colorIcon">
            notifications
          </v-icon>
        </v-badge>
      </template>
      <notificationMiniShow :notificationsItems="getNotificationsWithoutRead"
                            v-on:updateNotifications="getNotifications"/>
    </v-menu>
  </div>
</template>

<script>
import notificationMiniShow from "../NotificationButtonMiniShow";
import notificationProvider from "../../providers/notificationProvider";

export default {
  components: {notificationMiniShow},
  mounted() {
    this.getNotifications()
  },
  props: {
    userId: String,
    colorIcon: {type: String, default: 'primary'},
  },
  data() {
    return {
      items: [],
      limit: 0,
      type: null,
      isRead: false,
      itemsWithoutRead: []
    }
  },
  methods: {
    pollData() {
      setInterval(() => {
        this.getNotificationsForPolling()
      }, this.timePolling)
    },
    getNotifications() {
      if (this.activateWebSocket) {
        this.subscribeNotification()
      } else {
        this.getNotificationsForPolling()
        this.pollData()
      }
    },
    getNotificationsForPolling() {
      notificationProvider.fetchNotifications(this.limit, this.isRead, this.type)
          .then(res => {
            this.items = res.data.fetchNotifications
          })
          .catch(err => {
            console.log('Error: ', err)
          })
    },
    subscribeNotification() {
      notificationProvider.subscriptionNotification(this.userId).subscribe(res => {
        this.items.push(res.data.notification)
      })
    }
  },
  computed: {
    activateWebSocket(){
      return process.env.VUE_APP_ACTIVATE_WEB_SOCKET
    },
    timePolling(){
      return process.env.VUE_APP_TIME_POLLING
    },
    totalNotifications() {
      return this.getNotificationsWithoutRead.length
    },
    getNotificationsWithoutRead() {
      return this.items.filter(item => !item.read);
    },
  }
};
</script>

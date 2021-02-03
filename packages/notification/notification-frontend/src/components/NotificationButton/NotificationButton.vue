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

  props: {
    userId: String,
    colorIcon: {type: String, default: 'onPrimary'},
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
  mounted() {
    this.getNotifications()
  },
  methods: {
    getNotifications() {
      if (this.activateWebSocket) {
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
      notificationProvider.fetchNotifications(this.limit, this.isRead, this.type)
          .then(res => {
            this.items = res.data.fetchNotifications
          })
          .catch(err => {
            console.log('Error: ', err)
          })
    },
    subscribeNotification() {
      if(!this.userId){
        console.error("NotificationButton: imposible subscribe, userId prop is missing")
        return
      }
      notificationProvider.subscriptionNotification(this.userId).subscribe(res => {
        this.items.unshift(res.data.notification)
      })
    }
  },
  computed: {
    activateWebSocket(){
      return process.env.VUE_APP_ACTIVATE_WEB_SOCKET ? process.env.VUE_APP_ACTIVATE_WEB_SOCKET : true
    },
    timePolling(){
      return process.env.VUE_APP_TIME_POLLING ? parseInt(process.env.VUE_APP_TIME_POLLING) : 30000
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

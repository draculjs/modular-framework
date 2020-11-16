<template>
  <div class="text-center">
    <v-menu offset-y left open-on-hover :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }" >
        <v-badge
          :content="totalNotifications"
          :value="totalNotifications"
          color="secondary"
          overlap
        >
          <v-icon  v-bind="attrs" v-on="on" :color="colorIcon">
            notifications
          </v-icon>
        </v-badge>
      </template>
      <notificationMiniShow :notificationsItems="getNotificationsWithoutRead" v-on:updateNotifications="getNotifications"/>
    </v-menu>
  </div>
</template>

<script>
import notificationMiniShow from "../NotificationButtonMiniShow";
import notificationProvider from "../../providers/notificationProvider";

export default {
  components: { notificationMiniShow },
  mounted(){
     this.getNotifications()
    // this.pollData()
    this.subscribeNotification();
  },
  props:{
    userId: String,
    colorIcon: {type: String, default: 'primary'}
  },
  data(){
    return{
      items: [],
      limit: 0,
      type: null,
      isRead: false,
      itemsWithoutRead:[]
    }
  },
   methods:{
    pollData (){
		setInterval(() => {
			this.getNotifications()
        }, 30000)
    },
    getNotifications(){
      notificationProvider.fetchNotifications(this.limit, this.isRead, this.type)
      .then(res => {
        this.items = res.data.fetchNotifications
      })
      .catch(err => {
        console.log('Error: ',err)
      })
    },
    subscribeNotification(){
      notificationProvider.subscriptionNotification(this.userId).subscribe(res => {
        console.log('Subscribe: ',res.data)
        this.items.push(res.data.notification)
      })
    }
  },
  computed: {
    totalNotifications(){
      return this.getNotificationsWithoutRead.length
    },
    getNotificationsWithoutRead() {
      return this.items.filter(item => !item.read);
    },
   }
};
</script>

<template>
  <div class="text-center" v-if="mustShow">
    <v-menu offset-y left open-on-hover :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }" >
        <v-badge
          :content="totalNotifications"
          :value="totalNotifications"
          color="secondary"
          overlap
        >
          <v-icon  v-bind="attrs" v-on="on" color="white">
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
import notificationProvider from "../providers/notificationProvider";
import {mapGetters} from 'vuex'

export default {
  components: { notificationMiniShow },
  mounted(){
     this.getNotifications()
    // this.pollData()
    this.subscribeNotification();
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

      notificationProvider.subscriptionNotification(this.me.id).subscribe(res => {
        console.log(res.data)
        this.items.push(res.data.notification)
      })
    }
  },
  computed: {
    ...mapGetters(['isAuth', 'hasRole', 'me']),
            mustShow() {
                return this.hasRole('admin') || this.hasRole('operator')
            },
    totalNotifications(){
      return this.getNotificationsWithoutRead.length
    },
    getNotificationsWithoutRead() {
      return this.items.filter(item => !item.read);
    },
   }
};
</script>


computed: {
            ...mapGetters(['isAuth', 'hasRole']),
            mustShow() {
                return this.hasRole('admin')
            }
        }

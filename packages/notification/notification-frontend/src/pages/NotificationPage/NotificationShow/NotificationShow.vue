<template>
  <v-card class="elevation-6">
    <v-card-title>
      <v-row>
        <v-col class="text-xs-center">
          <h2>{{ this.$t("notification.title") }}</h2>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <notification-show-list/>
    </v-card-text>
  </v-card>
</template>

<script>
import notificationShowList from "../NotificationShowList";

export default {
  name: "notificationShow",
  components: {
    notificationShowList
  }
};
</script>


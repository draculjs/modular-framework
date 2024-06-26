<template>
  <v-list-item
    :class="{ 'grey lighten-4 mb-0 ml-n4 mr-n4': item.read, 'white mb-0 ml-n4 mr-n4': !item.read}"
  >
    <v-list-item-avatar color="primary">
      <v-icon
        :class="{
          'white--text grey': item.read,
          'white--text': !item.read,
        }"
      >
        {{ item.icon }}</v-icon
      >
    </v-list-item-avatar>

    <!-- CONTENIDO DE NOTIFICACION -->
    <v-list-item-content max-width="50px">
      <v-list-item-title
        :class="{
          'font-weight-regular': item.read,
          'font-weight-bold': !item.read,
        }"
        v-text="item.title"
      ></v-list-item-title>
      <p class="caption d-inline-block">
        {{ cleanContent(item.content) }}
      </p>
      <v-btn
        v-if="getUrl(item.content) != undefined"
        outlined
        small
        color="green"
        :href="getUrl(item.content)"
      >
        {{ $t("notification.downloadButton") }}
        <v-icon>get_app</v-icon>
      </v-btn>
      <p v-show="item.read" class="caption grey--text pb-0 mb-0">
        {{ $t("notification.readDate") }}{{ getDate(item.readDate) }}
      </p>
      <p v-show="!item.read" class="caption grey--text  pb-0 mb-0">
        {{ $t("notification.received") }}
        {{ relativeDate(item.creationDate) }}
      </p>
    </v-list-item-content>

    <v-list-item-action>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            v-on="on"
            v-on:click="changeStateRead(item)"
            :class="{
              'grey--text lighten-1': item.read,
              'orange--text': !item.read,
            }"
          >
            {{ item.read ? "mdi-email-open" : "mdi-email" }}
          </v-icon>
        </template>

        <span>{{
          item.read
            ? $t("notification.markNotRead")
            : $t("notification.markRead")
        }}</span>
      </v-tooltip>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
import notificationProvider from "../../../providers/notificationProvider";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es'
import 'dayjs/locale/pt'

export default {
  props: {
    item: {},
  },
  methods: {
    getDate(date) {
      dayjs.extend(localizedFormat);
      dayjs.locale(this.$t("notification.locale"))

      let dateFormat = parseInt(date)
      let currentDate = dayjs(dateFormat);

      let dateParse = dayjs(currentDate).format('llll');

      if (dateParse == this.$t("notification.invalidDate")) {
        return dayjs().format("llll");
      } else {
        return dateParse;
      }
    },
    changeStateRead(item) {
      notificationProvider
        .markAsReadOrNotRead(item.id, item.read)
        .then((res) => {
          item.read = res.data.markAsReadOrNotRead.read;
        })
        .catch((err) => {
          this.snackbarColor = "error";
          this.snackbarMessage = this.$t("notification.errorNotifications");
          console.log("Error al marcar como leido/no leido", err);
        });
    },
    relativeDate(date) {
      dayjs.extend(relativeTime)
      dayjs.locale(this.$t("notification.locale"))

      let dateFormat = parseInt(date)
      let currentDate = dayjs(dateFormat);

      return dayjs(currentDate).fromNow();
    },
    cleanContent(content){
      let newArray = content.split(';;');
      let newContent = newArray[0];
      return newContent
    },
    getUrl(content){
      let newArray = content.split(';;');
      let newUrl = newArray[1];
      return newUrl
    }
  },
};
</script>

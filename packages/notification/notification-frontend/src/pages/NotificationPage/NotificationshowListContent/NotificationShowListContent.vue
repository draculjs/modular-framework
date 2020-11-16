<template>
  <v-list-item
    :class="{ 'grey lighten-4 ml-n4 mr-n4': item.read, 'white ml-n4 mr-n4': !item.read}"
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
        {{ item.content }}
      </p>
      <p v-show="item.read" class="caption grey--text">
        {{ $t("notification.readDate") }}{{ getDate(item.readDate) }}
      </p>
      <p v-show="!item.read" class="caption grey--text">
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
import moment from "moment-timezone";
export default {
  props: {
    item: {},
  },
  methods: {
    getDate(date) {
      let num = parseInt(date);
      let fecha = moment(num).format("llll");

      if (fecha == this.$t("notification.invalidDate")) {
        return moment().format("llll");
      } else {
        return fecha;
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
      let num = parseInt(date);
      let newDate = moment(num).fromNow();
      return newDate;
    },
  },
};
</script>

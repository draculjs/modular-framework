<template>
    <v-card class="mx-auto" max-width="280" max-height="300">
        <v-toolbar
                class="mb-n6 mt-n3"
                color="secondary"
                dark
                v-if="items.length > 0"
        >
            <span>{{ this.$t("notification.title") }}</span>
            <v-spacer></v-spacer>
            <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon
                            class="onSecondary--text"
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

        <!-- SI NO HAY NOTIFICACIONES MUESTRA ESTO -->
        <v-card-text class="pa-0" v-if="items.length === 0">
            <v-list >
                <v-spacer></v-spacer>
                <v-list-item class="pt-3">
                    <p>{{ $t("notification.noNotifications") }}</p>
                </v-list-item>
            </v-list>
        </v-card-text>


        <!-- HAY NOTIFICACIONES -->
        <v-card-text class="pa-0" v-else>
            <v-list >
                <template v-for="(item, index) in items">
                    <v-list-item
                            :key="item.id"
                            :class="{ 'grey lighten-2': item.read, white: !item.read }"
                    >


                        <!-- CONTENIDO DE NOTIFICACION -->
                        <v-list-item-content>
                            <v-list-item-title
                                    :class="{
                'font-weight-regular': item.read,
                'font-weight-bold': !item.read,
              }"
                            >
                                {{item.title}}
                            </v-list-item-title>
                            <p class="caption d-inline-block">
                                {{ cleanContent(item.content) }}
                            </p>
                            <p class="grey--text caption d-inline-block">
                                {{ getRelativeDate(item.creationDate) }}
                            </p>
                        </v-list-item-content>

                        <v-list-item-action>
                            <v-tooltip left>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                            :class="{
                    'grey--text lighten-1': item.read,
                    'orange--text': !item.read,
                  }"
                                            v-bind="attrs"
                                            v-on="on"
                                            @click="changeStateRead(item)"
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

                    <v-divider  :key="index"></v-divider>
                </template>
            </v-list>
        </v-card-text>

        <v-card-actions justify="center" class="text-center mt-n1 mb-n3">
            <v-btn small text class=" blue--text" to="/notifications"
            >{{ this.$t("notification.seeEverything") }}
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script>
    import notificationProvider from "../../providers/notificationProvider";
    import dayjs from 'dayjs';  
    import relativeTime from 'dayjs/plugin/relativeTime';
    import 'dayjs/locale/es'
    import 'dayjs/locale/pt'

    export default {
        props: {
            notificationsItems: Array,
        },
        mounted() {
            this.$emit("updateNotifications");
        },
        methods: {
            changeStateRead(item) {
                notificationProvider
                    .markAsReadOrNotRead(item.id, item.read)
                    .then((res) => {
                        item.read = res.data.markAsReadOrNotRead.read;
                        this.$emit("updateNotifications");
                    })
                    .catch((err) => {
                        console.log("Error al marcar como leido/no leido", err);
                    });
            },
            markAllRead() {
                notificationProvider
                    .markAllReadOrNotRead(false)
                    .then(() => {
                        this.$emit("updateNotifications");
                    })
                    .catch((err) => {
                        this.snackbarColor = "error";
                        this.snackbarMessage = this.$t("notification.errorNotifications");
                        console.log("Error al marcar los correos como leidos, error: ", err);
                    });
            },
            getRelativeDate(date) {
                dayjs.extend(relativeTime)
                dayjs.locale(this.$t("notification.moment"))

                let dateFormat = parseInt(date)
                let currentDate = dayjs(dateFormat);
                
                return dayjs(currentDate).fromNow();
            },
            cleanContent(content){
                let newArray = content.split(';;');
                let newContent = newArray[0];
                return newContent
            }
        },
        computed: {
            items: {
                get() {
                    return this.notificationsItems;
                },
            },
        },
    };
</script>

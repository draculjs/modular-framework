<template>
    <v-row>
      <v-col cols="12" sm="12" md="12" class="text-center">
        <user-avatar :user="item"></user-avatar>
      </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                <user-show-data-item :item="item.name" :label="$t('user.label.fullname')" icon="account_box"/>
                <user-show-data-item :item="item.username" :label="$t('user.label.username')" icon="account_circle"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                <user-show-data-item :item="item.email" :label="$t('user.label.email')" icon="alternate_email"/>
                <user-show-data-item :item="item.phone" :label="$t('user.label.phone')" icon="phone"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                <user-show-data-item :item="item.active?'Activo':'Inactivo'" :label="$t('user.label.active')"
                                :icon="item.active?'done':'clear'"/>
                <user-show-data-item :item="item.role.name" :label="$t('user.label.role')" icon="phone"/>
            </v-list>
        </v-col>

        <v-col cols="12" class="py-0">
            <v-row>
                <v-col cols="12" md="12" class="py-0">{{$t('user.label.groups')}}:</v-col>
                <v-col cols="12" md="12" class="py-0">
                    <v-chip-group class="text-left">
                        <v-chip v-for="group in item.groups" :key="group.id">
                            {{ group.name }}
                        </v-chip>
                    </v-chip-group>
                </v-col>
            </v-row>

        </v-col>
    </v-row>


</template>
<script>
    import UserShowDataItem from "./UserShowDataItem"
    import UserAvatar from "../../../components/UserAvatar";

    export default {
        name: 'user-show-data',
        components: {UserAvatar, UserShowDataItem},
        props: {
            item: {}
        }
    }
</script>

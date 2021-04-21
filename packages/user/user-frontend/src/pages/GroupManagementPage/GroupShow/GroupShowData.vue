<template>
  <v-row>
    <v-col cols="12" sm="6" md="6">
      <v-list>
        <v-list-item>
          <v-list-item-icon class="mr-5">
            <v-avatar size="36px" :color="item.color?item.color:'grey'">
              <h3 class="white--text h3">{{ getAvatar(item) }}</h3>
            </v-avatar>
          </v-list-item-icon>

          <v-list-item-content class="mr-0">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ $t('group.label.name') }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>

    <v-col cols="12" sm="6" md="4">
      <v-list>
        <group-show-item :item="item.color" :label="$t('group.label.color')" icon="account_box"/>
      </v-list>
    </v-col>

    <v-col cols="12" class="py-0">
      <v-row>
        <v-col cols="12" md="12" class="py-0">{{ $t('group.label.users') }}:</v-col>
        <v-col cols="12" md="12" class="py-0">
          <v-chip-group class="text-left">
            <v-chip v-for="user in item.users" :key="user.id">
              {{ user.username }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

    </v-col>

  </v-row>
</template>
<script>
import GroupShowItem from "./GroupShowDataItem"

export default {
  name: 'group-show-data',
  components: {GroupShowItem},
  props: {
    item: {}
  },
  computed: {
    getAvatar() {
      return item => {
        if (item.name.length >= 2) {
          return item.name.charAt(0) + item.name.charAt(1)
        } else if (item.name.length >= 1) {
          return item.name.charAt(0)
        } else {
          return ""
        }
      }

    },
  }
}
</script>


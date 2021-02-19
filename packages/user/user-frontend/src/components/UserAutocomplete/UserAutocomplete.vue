<template>
  <v-autocomplete
      v-model="userValue"
      :items="users"
      :filled="filled"
      :solo="solo"
      chips
      :color="color"
      :background-color="backgroundColor"
      :label="$t(label)"
      :placeholder="$t(placeholder)"
      :item-text="'username'"
      :item-value="'id'"
      :multiple="multiple"
      :loading="loading"
  >
    <template v-slot:selection="data">
      <v-chip
          v-bind="data.attrs"
          :input-value="data.selected"
          close
          @click="data.select"
          @click:close="remove(data.item.id)"
      >
        <v-avatar left>
          <v-img v-if="data.item.avatarurl" :src="data.item.avatarurl"/>
          <v-img v-else src="@/assets/user.png"/>
        </v-avatar>
        {{ data.item.username }}
      </v-chip>
    </template>
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-avatar>
          <img v-if="data.item.avatarurl" :src="data.item.avatarurl"/>
          <img v-else src="@/assets/user.png"/>

        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.username"></v-list-item-title>
          <v-list-item-subtitle v-html="data.item.name"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>

</template>

<script>
import UserProvider from "../../providers/UserProvider";

export default {
  name: "UserAutocomplete",
  props: {
    value: {
      type: [String, Array]
    },
    filled: {type: Boolean, default: false},
    solo: {type: Boolean, default: false},
    multiple: {type: Boolean, default: false},
    chips: {type: Boolean, default: false},
    color: {type:String,default:"blue-grey lighten-2"},
    backgroundColor: {type:String},
    label: {type:String,default: 'user.user'},
    placeholder: {type:String,default: 'user.user'}
  },
  data() {
    return {
      users: [],
      loading: false
    }
  },
  computed: {
    userValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.loadUsers()
  },
  methods: {
    remove(id) {
      const index = this.userValue.indexOf(id)
      if (index >= 0) this.userValue.splice(index, 1)
    },
    loadUsers() {
      this.loading = true
      UserProvider.users().then(r => {
            this.users = r.data.users
          }
      ).catch(err => {
        console.error(err)
      }).finally(() => this.loading = false)
    }
  }
}
</script>

<style scoped>

</style>

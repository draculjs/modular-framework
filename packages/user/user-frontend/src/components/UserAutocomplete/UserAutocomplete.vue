<template>
  <v-autocomplete
      v-model="userValue"
      :items="users"
      :filled="filled"
      :solo="solo"
      :chips="chips"
      :color="color"
      :background-color="backgroundColor"
      :label="$t(label)"
      :placeholder="$t(placeholder)"
      :item-text="'username'"
      :item-value="'id'"
      :multiple="multiple"
      :loading="loading"
      :clearable="clearable"
  >
    <template v-slot:selection="data">
      <v-chip
          v-if="chips"
          v-bind="data.attrs"
          :input-value="data.selected"
          close
          @click="data.select"
          @click:close="remove(data.item.id)"
      >
        <v-avatar left>
          <v-img v-if="data.item.avatarurl" :src="data.item.avatarurl"/>
          <v-img v-else :src="getDefaultAvatar"/>
        </v-avatar>
        {{ data.item.username }}
      </v-chip>

      <v-list-item v-else>
        <v-list-item-avatar>
          <img v-if="data.item.avatarurl" :src="data.item.avatarurl"/>
          <img v-else :src="getDefaultAvatar"/>

        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.username"></v-list-item-title>
          <v-list-item-subtitle v-html="data.item.name"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-avatar>
          <img v-if="data.item.avatarurl" :src="data.item.avatarurl"/>
          <img v-else :src="getDefaultAvatar"/>

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
    clearable: {type: Boolean, default: false},
    color: {type: String, default: "blue-grey lighten-2"},
    backgroundColor: {type: String},
    label: {type: String, default: 'user.users'},
    placeholder: {type: String, default: 'user.users'},
    defaultAvatar: {type: String}
  },
  data() {
    return {
      users: [],
      loading: false
    }
  },
  computed: {
    getDefaultAvatar() {
      return this.defaultAvatar ? this.defaultAvatar : require("../../assets/user.png")
    },
    userValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
       // this.$emit('usersSelected', this.users.filter(u => val.includes(u.id)))
      }
    }
  },
  mounted() {
    this.loadUsers()
  },
  methods: {
    remove(id) {
      if (this.multiple) {
        const index = this.userValue.indexOf(id)
        if (index >= 0) {
          let aux = [...this.userValue]
          aux.splice(index, 1)
          this.userValue = aux
        }
      } else {
        this.userValue = null
      }

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

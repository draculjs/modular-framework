<template>
  <v-autocomplete v-model="userValue" :items="users" :filled="filled" :solo="solo" :chips="chips" :color="color"
    :background-color="backgroundColor" :label="$t(label)" :placeholder="$t(placeholder)" :item-text="'username'"
    :item-value="'id'" :multiple="multiple" :loading="loading" :clearable="clearable" :rules="rules"
    :hide-details="hideDetails">

    <template v-slot:item="data">
      <template v-if="(typeof data.item !== 'object')">
        <v-list-item-content v-text="data.item" />
      </template>

      <template v-else>
        <v-list-item-avatar>
          <img v-if="data.item.avatarurl" :src="data.item.avatarurl" />

          <img v-else :src="getDefaultAvatar" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-html="data.item.username" />

          <v-list-item-subtitle v-html="data.item.name" />
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>

</template>

<script>
import UserProvider from "../../providers/UserProvider";
import defaultUserImage from "../../assets/user.png";

export default {
  name: "UserAutocomplete",
  props: {
    value: {
      type: [String, Array]
    },
    required: {
      type: Boolean,
      required: false
    },
    filled: { type: Boolean, default: false },
    solo: { type: Boolean, default: false },
    hideDetails: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    chips: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    color: { type: String, default: "blue-grey lighten-2" },
    backgroundColor: { type: String },
    label: { type: String, default: 'user.users' },
    placeholder: { type: String, default: 'user.users' },
    defaultAvatar: { type: String },
    roleName: { type: String },
    roleNames: { type: Array }
  },
  data() {
    return {
      users: [],
      loading: false
    }
  },
  computed: {
    rules() {
      if (this.required) return [v => (!!v || v === 0) || this.$t('common.required')];
      return []
    },
    getDefaultAvatar() {
      return this.defaultAvatar ? this.defaultAvatar : defaultUserImage
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
    async loadUsers() {
      try {
        this.loading = true

        if (this.roleName) {
          this.users = (await UserProvider.usersByRole(this.roleName)).data.usersByRole
        } else if (this.roleNames && this.roleNames.length > 0) {
          this.users = UserProvider.usersByRoles(this.roleNames).then(r => { this.users = r.data.usersByRoles })
        } else {
          UserProvider.users().then(r => { this.users = r.data.users })
        }

      } catch (error) {
        console.log("An error happened while loading users at the userAutoComplete component: ", error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

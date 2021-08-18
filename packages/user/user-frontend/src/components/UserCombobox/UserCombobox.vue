<template>
  <v-select
      v-model="userValue"
      :loading="loading"
      :items="users"
      :item-text="'username'"
      :item-value="'id'"
      :chips="chips"
      :label="multiple ? $t('user.users') : $t('user.user')"
      :placeholder="multiple ? $t('user.users') : $t('user.user')"
      :multiple="multiple"
      :hide-details="hideDetails"
      :dense="dense"
  ></v-select>
</template>

<script>
import UserProvider from "../../providers/UserProvider";

export default {
  name: "UserCombobox",
  props: {
    value: {
      type: [String, Array]
    },
    multiple: {type: Boolean, default: false},
    chips: {type: Boolean, default: false},
    hideDetails: {type: Boolean, default: false},
    dense: {type: Boolean, default: false},
    roleName: {type: String}
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
    loadUsers() {
      this.loading = true
      if(this.roleName){
        UserProvider.usersByRole(this.roleName)
            .then(r => {this.users = r.data.usersByRole})
            .catch(err => {console.error(err)})
            .finally(() => this.loading = false)
      }else{
        UserProvider.users()
            .then(r => {this.users = r.data.users})
            .catch(err => {console.error(err)})
            .finally(() => this.loading = false)
      }
    }
  }
}
</script>

<style scoped>

</style>

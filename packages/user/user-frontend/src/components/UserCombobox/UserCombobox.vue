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
      :clearable="clearable"
      :disabled="disabled"
      :rules="rules"
      :filled="filled"
      :solo="solo"
      :flat="flat"
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
    required: {
      type: Boolean,
      required: false
    },
    multiple: {type: Boolean, default: false},
    chips: {type: Boolean, default: false},
    hideDetails: {type: Boolean, default: false},
    dense: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    clearable: {type: Boolean, default: false},
    filled: {type: Boolean, default: false},
    solo: {type: Boolean, default: false},
    flat: {type: Boolean, default: false},
    roleName: {type: String},
    roleNames: {type: Array}

  },
  data() {
    return {
      users: [],
      loading: false
    }
  },
  computed: {
    rules(){
      if(this.required) return [v => (!!v || v === 0) || this.$t('common.required')]
      return []
    },
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
      }else if(this.roleNames && this.roleNames.length > 0){
        UserProvider.usersByRoles(this.roleNames)
            .then(r => {this.users = r.data.usersByRoles})
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

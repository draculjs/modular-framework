<template>
  <v-select
      v-model="userValue"
      :loading="loading"
      :items="users"
      :item-text="'username'"
      :item-value="'id'"
      :chips="chips"
      :label="$t('user.user')"
      :placeholder="$t('user.user')"
      :multiple="multiple"
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
      multiple: {type:Boolean, default:false},
      chips: {type:Boolean, default:false}
  },
  data() {
    return {
      users: [],
      loading: false
    }
  },
  computed: {
    userValue: {
      get() { return this.value },
      set(val) {this.$emit('input', val)}
    }
  },
  mounted() {
    this.loadUsers()
  },
  methods:{
    loadUsers(){
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

<template>
  <v-select
      v-model="roleValue"
      :loading="loading"
      :items="roles"
      :item-text="'name'"
      :item-value="'id'"
      :chips="chips"
      :label="$t('role.role')"
      :placeholder="$t('role.role')"
      :multiple="multiple"
  ></v-select>
</template>

<script>
import RoleProvider from "../../providers/RoleProvider";

export default {
  name: "RoleCombobox",
  props: {
      value: {
        type: [String, Array]
      },
      multiple: {type:Boolean, default:false},
      chips: {type:Boolean, default:false}
  },
  data() {
    return {
      roles: [],
      loading: false
    }
  },
  computed: {
    roleValue: {
      get() { return this.value },
      set(val) {this.$emit('input', val)}
    }
  },
  mounted() {
    this.load()
  },
  methods:{
    load(){
      this.loading = true
      RoleProvider.roles().then(r => {
            this.roles = r.data.roles
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

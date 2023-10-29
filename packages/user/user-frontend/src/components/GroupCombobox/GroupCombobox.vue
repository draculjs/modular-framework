<template>
  <v-select
      v-model="groupValue"
      :loading="loading"
      :items="groups"
      :item-text="'name'"
      :item-value="'id'"
      :chips="chips"
      :label="multiple ? $t('group.groups') : $t('group.group')"
      :placeholder="multiple ? $t('group.groups') : $t('group.group')"
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
import GroupProvider from "../../providers/GroupProvider";

export default {
  name: "GroupCombobox",
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
  },
  data() {
    return {
      groups: [],
      loading: false
    }
  },
  computed: {
    rules(){
      if(this.required) return [v => (!!v || v === 0) || this.$t('common.required')]
      return []
    },
    groupValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.loadGroups()
  },
  methods: {
    loadGroups() {
      this.loading = true
        GroupProvider.groups()
            .then(r => {this.groups = r.data.groups})
            .catch(err => {console.error(err)})
            .finally(() => this.loading = false)
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <crud-update
    :open="open"
    :loading="loading"
    :title="title"
    :errorMessage="errorMessage"
    @update="update"
    @close="$emit('close')"
  >
    <settings-form ref="form" v-model="form" :item="item" :input-errors="inputErrors"/>
  </crud-update>
</template>

<script>

import SettingsProvider from "../../../providers/SettingsProvider";

import {CrudUpdate, ClientError} from '@dracul/common-frontend'

import SettingsForm from "../SettingsForm";


export default {
  name: "SettingsUpdate",

  components: {SettingsForm, CrudUpdate},

  props: {
    open: {type: Boolean, default: true},
    item: {type: Object, required: true}
  },

  data() {
    return {
      title: 'settings.settings.editing',
      errorMessage: '',
      inputErrors: {},
      loading: false,
      form: {
        value: this.item.value,
        valueList: this.item.valueList ? this.item.valueList : [],
      }

    }
  },
  computed: {
    getValue(){
      return this.form.value === null ? null : this.form.value.toString()
    },
    getValueList(){
      return (this.form.valueList && this.form.valueList.length > 0) ? this.form.valueList.map(i => i.toString()) : []
    }
  },
  methods: {
    update() {
      if (this.$refs.form.validate()) {
        this.loading = true
        SettingsProvider.settingValueUpdateByKey(this.item.key, this.getValue, this.getValueList).then(r => {
              this.$store.dispatch('loadSettings')
              this.$emit('itemUpdated', r.data.settingValueUpdateByKey)
              this.$emit('close')
            }
        ).catch(error => {
          let clientError = new ClientError(error)
          this.inputErrors = clientError.inputErrors
          this.errorMessage = clientError.i18nMessage
        }).finally(() => this.loading = false)
      }

    }
  },
}
</script>

<style scoped>

</style>


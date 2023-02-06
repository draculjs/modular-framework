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
        id: this.item.id,
        key: this.item.key,
        text: this.item.text,
        value: this.item.value,
        label: {
          en: this.item.label.en,
          es: this.item.label.es,
          pt: this.item.label.pt
        }
      }
    }
  },
  computed: {
    getForm(){
      const form = this.form
      if (form.value) form.value = form.value.toString()

      return form
    }
  },
  methods: {
    update() {
      if (this.$refs.form.validate()) {
        this.loading = true
        SettingsProvider.updateSettings(this.getForm).then(r => {
              this.$store.dispatch('loadSettings')
              this.$emit('itemUpdated', r.data.settingsUpdate)
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


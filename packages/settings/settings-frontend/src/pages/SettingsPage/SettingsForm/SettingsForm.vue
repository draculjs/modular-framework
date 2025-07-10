<template>
  <v-form ref="form" autocomplete="off" @submit.prevent>
    <v-row>
      <v-col cols="12">
        <!--string-->
        <v-text-field v-if="!item.type || item.type === 'string' || item.type === 'password'"
                      prepend-icon="text_snippet"
                      :name="item.key" v-model="form.value"
                      :label="item.label[getLanguage]" :placeholder="item.label[getLanguage]" color="secondary"
                      :rules="validateRegex"
                      :prefix="item.prefix"
                      :suffix="item.suffix"
        >
        </v-text-field>

        <!--number-->
        <v-text-field v-if="item.type === 'number'"
                      prepend-icon="text_snippet" type="number"
                      v-model.number="form.value" :name="item.key"
                      :label="item.label[getLanguage]" :placeholder="item.label[getLanguage]"
                      :rules="validateNumber"
                      color="secondary"
                      :prefix="item.prefix"
                      :suffix="item.suffix"
        >
        </v-text-field>

        <!--boolean-->
        <v-checkbox v-if="item.type === 'boolean'"
                    prepend-icon="text_snippet"
                    :name="item.key" value="enable"
                    v-model="form.value" :label="item.label[getLanguage]" :placeholder="item.label[getLanguage]"
                    color="secondary">
        </v-checkbox>


        <!--enum-->
        <v-select v-if="item.type === 'enum'"
                  prepend-icon="text_snippet"
                  :name="item.key" :items="item.options"
                  v-model="form.value"
                  :label="item.label[getLanguage]" :placeholder="item.label[getLanguage]"
                  color="secondary">
        </v-select>

        <!--dynamic-->
        <v-select v-if="item.type === 'dynamic'" prepend-icon="list"
                  :name="item.key" item-text="entityText" item-value="entityValue"
                  :items="this.entityOptions" v-model="form.value"
                  :label="item.label[getLanguage]" :placeholder="item.label[getLanguage]"
                  color="secondary">
        </v-select>


        <!--stringList-->
        <v-combobox v-if="item.type === 'stringList'"
                    prepend-icon="list" :name="item.key"
                    v-model="form.valueList"
                    chips multiple
                    :label="item.label[getLanguage]" :placeholder="item.label[getLanguage]"
                    color="secondary"
        >
        </v-combobox>

        <!--numberList-->
        <v-combobox v-if="item.type === 'numberList'"
                    prepend-icon="list" :name="item.key"
                    chips multiple
                    v-model="form.valueList"
                    :label="item.label[getLanguage]" :placeholder="item.label[getLanguage]"
                    color="secondary"
                    :rules="validateNumberList"
        >
        </v-combobox>

        <!--fileSetting-->
        <v-file-input v-if="item.type === 'file'"
          :loading="chargeFileValueLoading"
          prepend-icon="attach_file" :name="item.key"
          :value="fileValue"
          @change="updateFileValue($event)"
          :label="item.label[getLanguage]" :placeholder="item.label[getLanguage]"
          color="secondary"
        ></v-file-input>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>

import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'
import SettingsProvider from '../../../providers/SettingsProvider'
import {mapGetters} from "vuex";

export default {
  name: "SettingsForm",
  mixins: [InputErrorsByProps, RequiredRule],
  props: {
    value: {type: Object, required: true},
    item: {type: Object, required: true}
  },
  data() {
    return {
      entityOptions: [],
      fileValue: null,
      chargeFileValueLoading: false
    }
  },
  computed: {
    ...mapGetters(['getLanguage']),
    form: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    validateRegex() {
      return [val => {
        if (!this.item.regex) return true
        let regex = new RegExp(this.item.regex)
        if (typeof val === 'string') {
          return regex.test(val) || 'Formato Invalido.'
        }
        if (Array.isArray(val)) {
          return val.every(v => regex.test(v)) || 'Formato Invalido.'
        }

      }]
    },
    validateNumber() {
      return [val => {
        if (!this.item.regex) return true
        let regex = new RegExp(/\d+/)
        return regex.test(val) || 'Formato Invalido. Solo se esperan números.'
      }]
    },
    validateNumberList() {
      return [val => {
        let regex = new RegExp(/\d+/)
        return val.every(v => regex.test(v)) || 'Formato Invalido. Solo se esperan números.'
      }]
    }
  },
  watch: {
    form: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  },
  mounted() {
    if (this.item.type === 'file'){
      this.chargeFileValue()
    }
    if (this.item.type === 'dynamic') {
      this.fetchEntityOptions()
    }
  },
  methods: {
    async chargeFileValue(){
      try{
        this.chargeFileValueLoading = true
        if(this.form.value && (typeof this.form.value) == 'string'){
          const valueSplit = this.form.value.split('/')
          const filename = valueSplit[valueSplit.length - 1]
          const response = await fetch(this.value)
          const blob = await response.blob()
          this.fileValue = new File([Blob], filename, { type: blob.type })
          return
        }
        if(this.form.value){
          this.fileValue = this.form.value
          return
        }
        return null
      } finally {
        this.chargeFileValueLoading = false
      }
    },
    validate() {
      return this.$refs.form.validate()
    },
    async fetchEntityOptions() {

      SettingsProvider.fetchEntityOptions(this.item.key).then(response => {
        this.entityOptions = response.data.fetchEntityOptions
      })
    },
    updateFileValue(value){
      console.log('value: ', value)
      this.form.value = value
    }
  },

}
</script>

<style scoped>

</style>


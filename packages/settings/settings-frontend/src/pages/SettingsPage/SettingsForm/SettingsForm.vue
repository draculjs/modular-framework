<template>
  <v-form ref="form" autocomplete="off">
    <v-row>
      <v-col cols="12">
        <!--string-->
        <v-text-field
            v-if="!item.type || item.type === 'string' "
            prepend-icon="text_snippet"
            name="value"
            v-model="form.value"
            :label="form.label[getLanguage]"
            :placeholder="form.label[getLanguage]"
            color="secondary"
        ></v-text-field>

        <!--number-->
        <v-text-field
            v-if="item.type === 'number' "
            prepend-icon="text_snippet"
            name="value"
            type="number"
            v-model.number="form.value"
            :label="form.label[getLanguage]"
            :placeholder="form.label[getLanguage]"
            color="secondary"
        ></v-text-field>

        <!--boolean-->
        <v-checkbox
            v-if="item.type === 'boolean' "
            prepend-icon="text_snippet"
            name="value"
            value="enable"
            v-model="form.value"
            :label="form.label[getLanguage]"
            :placeholder="form.label[getLanguage]"
            color="secondary"
        ></v-checkbox>


        <!--enum-->
        <v-select
            v-if="item.type === 'enum' "
            prepend-icon="text_snippet"
            name="value"
            :items="item.options"
            v-model="form.value"
            :label="form.label[getLanguage]"
            :placeholder="form.label[getLanguage]"
            color="secondary"
        ></v-select>

      </v-col>
    </v-row>
  </v-form>
</template>

<script>

import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'
import {mapGetters} from "vuex";

export default {
  name: "SettingsForm",
  mixins: [InputErrorsByProps, RequiredRule],
  props: {
    value: {type: Object, required: true},
    item: {type: Object, required: true}
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
  methods: {
    validate() {
      return this.$refs.form.validate()
    }
  }
}
</script>

<style scoped>

</style>


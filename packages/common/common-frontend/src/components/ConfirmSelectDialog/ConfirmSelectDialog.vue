<template>
  <v-dialog
      v-model="value"
      max-width="290"
      persistent
  >
    <v-card>
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ description }}
      </v-card-text>

      <v-container>
        <v-select
          width="100%"
          v-model="selection"
          :items="options"
        ></v-select>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
            color="grey"
            text
            @click="close"
        >
          {{ $t('common.cancel') }}
        </v-btn>

        <v-btn
            :color="confirmColor"
            @click="confirm"
        >
          {{ $t('common.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfirmSelectDialog",
  props: {
    value: {type: Boolean},
    title: {type: String},
    description: {type: String},
    confirmColor: {type:String, default: 'red darken-1 white--text'},
    defaultSelection: {type: String},
    options: {type: Array}
  },
  data(){
    return {
      selection: this.defaultSelection,
    }
  },
  methods: {
    close(){
      this.$emit('input', false)
    },
    confirm(){
      this.$emit('confirmed', this.selection)
      this.$emit('input', false)
    }
  }
}
</script>

<style scoped>

</style>
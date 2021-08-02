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
  name: "ConfirmDialog",
  props: {
    value: {type: Boolean},
    title: {type: String},
    description: {type: String},
    confirmColor: {type:String, default: 'red darken-1 white--text'}
  },
  methods: {
    close(){
      this.$emit('input', false)
    },
    confirm(){
      this.$emit('confirmed')
      this.$emit('input', false)
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <v-snackbar
        v-for="(error,i) in $store.getters.getGraphqlErrors" :key="error.key"
        color="red"
        bottom right
        :value="true"
        :style="{top: '-'+(50 * i+1) + 'px' }"
        :timeout="timeout"
    >
      {{ getMessage(error) }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "ErrorSnackbar",
  data() {
    return {
      timeout: 3000,
      snackbar: []
    }
  },
  methods: {
    close() {
      // console.log("close, actual lenght: ",this.$store.getters.getGraphqlErrors.length)
      this.$store.commit('removeGraphqlError')
    }
  },
  computed: {
    getMessage() {
      return error => {
        if (this.$te(error.message)) {
          return this.$t(error.message)
        }
        if (error.extensions && error.extensions.code && this.$te('error.code.' + error.extensions.code)) {
          return this.$t('error.code.' + error.extensions.code)
        }
        return this.$t('error.general')
      }
    }
  },
  watch: {
    '$store.state.base.graphqlErrorsCounter': {
      handler() {
        setTimeout(this.close, this.timeout)
      }
    }
  }

}
</script>

<style scoped>

</style>

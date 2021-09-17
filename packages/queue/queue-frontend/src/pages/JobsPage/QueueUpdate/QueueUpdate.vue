<template>
  <crud-update :open="open"
               :loading="loading"
               :title="title"
               :errorMessage="errorMessage"
               @update="update"
               @close="$emit('close')"
  >
    <queue-form ref="form" v-model="form" :input-errors="inputErrors"/>
  </crud-update>
</template>

<script>

import QueueProvider from "../../../providers/QueueProvider";

import {CrudUpdate, ClientError} from '@dracul/common-frontend'

import QueueForm from "../QueueForm";

import {Dayjs} from "@dracul/dayjs-frontend";

export default {
  name: "QueueUpdate",

  components: {QueueForm, CrudUpdate},

  props: {
    open: {type: Boolean, default: true},
    item: {type: Object, required: true}
  },

  data() {
    return {
      title: 'queue.queue.editing',
      errorMessage: '',
      inputErrors: {},
      loading: false,
      form: {
        id: this.item.id,
        blockedUntil: this.item.blockedUntil ? Dayjs(parseInt(this.item.blockedUntil)) : null,
        workerId: this.item.workerId,
        maxRetries: this.item.maxRetries,
        retries: this.item.retries,
        progress: this.item.progress,
        info: this.item.info,
        output: this.item.output,
        state: this.item.state,
        topic: this.item.topic,
        payload: this.item.payload,
        done: this.item.done,
        error: this.item.error
      }
    }
  },
  methods: {
    update() {
      if (this.$refs.form.validate()) {
        this.loading = true
        QueueProvider.updateQueue(this.form).then(r => {
              if (r) {
                this.$emit('itemUpdated', r.data.queueUpdate)
                this.$emit('close')
              }
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


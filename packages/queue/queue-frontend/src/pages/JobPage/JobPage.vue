<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="8">
        <v-card :loading="loading">
          <v-card-title>
            {{ job && job.topic }}
          </v-card-title>
          <v-card-subtitle>
            {{ getJobId }}
          </v-card-subtitle>

          <v-card-text>
            <v-row v-if="job" justify="center" no-gutters>

              <v-col cols="12" class="text-center">
                <v-progress-circular
                    color="primary"
                    :rotate="360"
                    :size="100"
                    :width="15"
                    :value="job.progress"
                >
                  {{ job.progress }}
                </v-progress-circular>

              </v-col>


              <v-col cols="12">
                <v-list>
                  <show-field :value="job.info" :label="$t('queue.queue.labels.info')" icon="info"/>
                  <show-field v-if="job.output" :value="job.output" :label="$t('queue.queue.labels.output')"
                              icon="logout"/>
                  <show-field v-if="job.error" :value="job.error" :label="$t('queue.queue.labels.error')" icon="error"/>

                </v-list>
              </v-col>


              <v-col cols="12" sm="6">
                <v-list>
                  <show-field :value="job.state" :label="$t('queue.queue.labels.state')" icon="fact_check"/>
                  <show-field :value="job.workerId" :label="$t('queue.queue.labels.workerId')" icon="badge"/>
                </v-list>
              </v-col>

              <v-col cols="12" sm="6">
                <v-list>
                  <show-field :value="(String(job.retries)+'/'+String(job.maxRetries))"
                              :label="$t('queue.queue.labels.retries')" icon="double_arrow"/>
                  <show-field v-if="!job.done" :value="getDateTimeFormat(job.blockedUntil)"
                              :label="$t('queue.queue.labels.blockedUntil')"
                              icon="event"/>
                </v-list>
              </v-col>

              <v-col cols="12">

              </v-col>
            </v-row>


          </v-card-text>

          <v-card-text>
            <h3>Payload</h3>
            <v-divider></v-divider>
            <div class="pa-3">
              {{ job && job.payload }}
            </div>
          </v-card-text>

        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import QueueProvider from "../../providers/QueueProvider";
import {ShowField} from '@dracul/common-frontend'
import {DayjsMixin} from "@dracul/dayjs-frontend";

export default {
  name: 'JobPage',
  components: {ShowField},
  mixins: [DayjsMixin],
  data() {
    return {
      job: null,
      loading: false
    }
  },
  computed: {
    getJobId() {
      return this.$route.params.id
    }
  },
  created() {
    this.autoRefresh()
  },
  methods: {
    autoRefresh() {

      this.getJob().then(() => {

            if (this.job && this.job.done === true) {
              return
            }
            setTimeout(this.autoRefresh, 3000)
          }
      )
    },
    getJob() {
      return new Promise((resolve => {
        this.loading = true
        QueueProvider.findQueue(this.getJobId)
            .then((res) => {
              this.job = res.data.queueFind
              resolve()
            })
            .finally(() => {
              this.loading = false

            })

      }))


    }
  }
}
</script>

<style scoped>

</style>

<template>
  <v-row>

    <v-col cols="12">
      <h3>Job:  {{ item.id }}</h3>
    </v-col>
    <v-col cols="12" sm="8" md="6">
      <v-list>
        <show-field :value="item.topic" :label="$t('queue.queue.labels.topic')" icon="topic"/>
        <show-field :value="item.state" :label="$t('queue.queue.labels.state')" icon="fact_check"/>
        <show-field :value="item.done" :label="$t('queue.queue.labels.done')" icon="done"/>
      </v-list>
    </v-col>

    <v-col cols="12" sm="6" md="4">
      <v-list>
        <show-field :value="item.workerId" :label="$t('queue.queue.labels.workerId')" icon="badge"/>
        <show-field :value="String(item.progress)" :label="$t('queue.queue.labels.progress')" icon="pending"/>
        <show-field :value="item.info" :label="$t('queue.queue.labels.info')" icon="info"/>

      </v-list>
    </v-col>

    <v-col cols="12" sm="6" md="4">
      <v-list>
        <show-field :value="(String(item.retries)+'/'+String(item.maxRetries))" :label="$t('queue.queue.labels.retries')" icon="double_arrow"/>
        <show-field :value="getDateTimeFormat(item.blockedUntil)" :label="$t('queue.queue.labels.blockedUntil')"
                    icon="event"/>
        <show-field :value="item.output" :label="$t('queue.queue.labels.output')" icon="logout"/>
        <show-field :value="item.error" :label="$t('queue.queue.labels.error')" icon="error"/>
      </v-list>
    </v-col>

    <v-col cols="12">
      <h3>Payload</h3>
      <v-divider></v-divider>
      {{ item.payload }}
    </v-col>
  </v-row>
</template>
<script>
import {ShowField} from '@dracul/common-frontend'
import {DayjsMixin} from "@dracul/dayjs-frontend";

export default {
  name: 'QueueShowData',
  components: {ShowField},
  mixins: [DayjsMixin],
  props: {
    item: {type: Object, required: true}
  }
}
</script>


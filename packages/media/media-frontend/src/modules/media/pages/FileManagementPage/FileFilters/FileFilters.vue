<template>
  <v-card flat class=" mx-2">
    <v-card-title class="pb-0">{{ "Filtros" }}</v-card-title>
    <v-card-text class="pt-0 mt-0">
      <v-row>
        <v-col cols="12" class="py-0">
          <v-row>
            <v-col cols="4">
              <date-input
                v-if="filters[0].field == 'dateFrom'"
                v-model="filters[0].value"
                :label="$t('media.file.createdAt')"
                prepend-icon="event"
                color="secondary"
                hide-details
              />
            </v-col>
            <v-col cols="4">
              <date-input
                v-model="filters[1].value"
                :label="$t('media.file.createdAt')"
                prepend-icon="event"
                color="secondary"
                hide-details
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="filters[2].value"
                :label="$t('media.file.filename')"
                prepend-icon="article"
                color="secondary"
                hide-details
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="filters[3].value" 
                :label="$t('media.file.createdBy')"
                prepend-icon="account_box"
                color="secondary"
                hide-details
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="filters[4].value"
                :label="$t('media.file.type')"
                prepend-icon="extension"
                color="secondary"
                hide-details
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="filters[5].value"
                :label="$t('media.file.size')"
                prepend-icon="album"
                color="secondary"
                hide-details
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="filters[6].value"
                :label="$t('media.file.size')"
                prepend-icon="album"
                color="secondary"
                hide-details
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="text-right">
          <v-btn small text color="secondary" @click="cleanFilters()">{{
            "Limpiar filtros"
          }}</v-btn>

          <v-btn small color="secondary" @click="setFilters()">{{
            "Aplicar filtros"
          }}</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>

import { DateInput } from '@dracul/dayjs-frontend'

export default {
  name: "FileFilters",
  components: { DateInput },
  props: {
    value: Array
  },
  computed: {
    filters: {
      get() {return this.value},
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    setFilters() {
      this.$emit("updateFilters", this.filters);
    },
    cleanFilters() {
      this.$emit("clearFilter", this.filters);
    },
  },
};
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card-actions class="align-items">
        <v-row>

          <v-col cols="12" md="4" sm="4">
            <v-text-field 
              v-model="filters[0].value" 
              :label="$t('audit.action')" 
              prepend-icon="bolt" 
              color="secondary"
              hide-details
              clearable 
            />
          </v-col>

          <v-col cols="12" md="4" sm="4">
            <v-text-field 
              v-model="filters[2].value" 
              :label="$t('audit.labels.entity')" 
              prepend-icon="article"
              color="secondary"
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="12" md="4" sm="4">
            <user-autocomplete 
              v-model="filters[1].value" 
              :label="$t('audit.filterByUser')" 
              clearable 
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-actions>
    </v-col>

    <v-col cols="12" class="text-right pr-5">
      <v-btn 
        small 
        text 
        color="secondary" 
        @click="cleanFilters()"
      >
        Limpiar filtros
      </v-btn>

      <v-btn 
        small 
        color="secondary" 
        @click="setFilters()"
      >
        Aplicar filtros
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>

import { UserAutocomplete } from '@dracul/user-frontend'
import { mapGetters } from 'vuex'


export default {
  name: "AuditFilters",
  components: { UserAutocomplete },
  props: {
    value: Array
  },
  computed: {
    ...mapGetters([
      'me'
    ]),
    filters: {
      get() { return this.value },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    setFilters() {
      this.$emit("updateFilters", this.filters);
    },
    cleanFilters() {
      this.$emit("clearFilter", this.filters);
    }
  },
};
</script>

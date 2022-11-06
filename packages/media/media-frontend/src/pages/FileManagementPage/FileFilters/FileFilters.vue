<template>
  <v-card flat class=" mx-2">
    <v-card-title class="pb-0">{{$t('media.file.filters')}}</v-card-title>
    <v-card-text class="pt-0 mt-0">
      <v-row>
        <v-col cols="12" class="py-0">
          <v-row>
            <v-col cols="12" sm="6" md="4"  >
              <date-input
                v-if="filters[0].field == 'dateFrom'"
                v-model="filters[0].value"
                :label="$t('media.file.from')"
                prepend-icon="event"
                color="secondary"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="6" md="4"  >
              <date-input
                v-model="filters[1].value"
                :label="$t('media.file.until')"
                prepend-icon="event"
                color="secondary"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="filters[2].value"
                :label="$t('media.file.filename')"
                prepend-icon="article"
                color="secondary"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-select
                v-model="filters[4].value"
                :label="$t('media.file.type')"
                :items="selectType"
                prepend-icon="extension"
                color="secondary"
                hide-details
              />
            </v-col>
             <v-col v-if="isUserAuthorized('FILE_SHOW_OWN')" cols="12" sm="6" md="2">
              <v-select
                  prepend-icon="visibility"
                  v-model="filters[7].value"
                  :items="[{text: 'Público', value: 'true'}, {text: 'Privado', value: 'false'}]"
                  :label="$t('media.file.visibility')"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6"  md="2">
              <v-text-field
                v-model="filters[5].value"
                :label="$t('media.file.sizeGt')"
                prepend-icon="album"
                color="secondary"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-text-field
                v-model="filters[6].value"
                :label="$t('media.file.sizeLt')"
                prepend-icon="album"
                color="secondary"
                hide-details
              />
            </v-col>
            <v-col v-if="isUserAuthorized('FILE_SHOW_ALL')" cols="12" md="4" sm="6">
              <user-autocomplete
                v-model="filters[3].value"
                :label="$t('media.file.createdBy')"
                solo>
              </user-autocomplete>
            </v-col>
            <v-col v-if="isUserAuthorized('FILE_SHOW_ALL')" cols="12" md="4" sm="6">
              <group-autocomplete
                v-model="filters[8].value"
                :label="$t('media.file.group')"
                solo>
              </group-autocomplete>
            </v-col>
            <v-col v-if="isUserAuthorized('FILE_SHOW_ALL')" cols="12" md="4" sm="6">
              <user-autocomplete
                v-model="filters[9].value"
                :label="$t('media.file.user')"
                solo>
              </user-autocomplete>
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

import { DateInput } from '@dracul/dayjs-frontend';
import { GroupAutocomplete, UserAutocomplete} from '@dracul/user-frontend'
import { mapGetters } from 'vuex'


export default {
  name: "FileFilters",
  components: { DateInput, GroupAutocomplete, UserAutocomplete },
  props: {
    value: Array
  },
  computed: {
    ...mapGetters([
      'me'
    ]),
    filters: {
      get() {return this.value},
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  data() {
    return {
      selectType: [
        { text: "text", value: "text" },
        { text: "image", value: "image" },
        { text: "application", value: "application" },
        { text: "audio", value: "audio" }
      ]
    }
  },
  methods: {
    setFilters() {
      this.$emit("updateFilters", this.filters);
    },
    cleanFilters() {
      this.$emit("clearFilter", this.filters);
    },
    isUserAuthorized(permission) {
      return this.me.role.permissions.includes(permission)
    }
  },
};
</script>

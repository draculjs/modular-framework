<template>
  <v-form ref="form" autocomplete="off" @submit.prevent="save">
    <v-row>

      <v-col cols="12" md="6" sm="6">
        <date-input
            v-model="form.expirationDate"
            :label="$t('media.file.expirationDate')"
            prepend-icon="event"
            persistent-hint
            color="secondary"
            :rules="fileExpirationTimeRules"
        />
      </v-col>

      <v-col cols="12" md="6" sm="6">
        <v-select
            prepend-icon="visibility"
            v-model="form.isPublic"
            :items="[{text: 'Público', value: true}, {text: 'Privado', value: false}]"
            :label="$t('media.file.visibility')"
        ></v-select>
      </v-col>

      <v-col cols="12" sm="12" md="12">
        <v-combobox
            prepend-icon="loyalty"
            v-model="form.tags"
            :label="$t('media.file.tags')"
            chips
            multiple
            color="secondary"
            item-color="secondary"
        ></v-combobox>
      </v-col>

      <v-col cols="12" sm="12">
        <v-text-field
            prepend-icon="description"
            name="filename"
            v-model="form.description"
            :label="$t('media.file.description')"
            :placeholder="$t('media.file.description')"
            :error="hasInputErrors('description')"
            :error-messages="getInputErrors('description')"
            color="secondary"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6" sm="12">
        <group-autocomplete
          v-model="form.groups"
          multiple
          :label="$t('media.file.groups')"
        ></group-autocomplete>
      </v-col>

      <v-col cols="12" md="6" sm="12">
        <user-autocomplete
          v-model="form.users"
          multiple
          :label="$t('media.file.users')"
        ></user-autocomplete>
      </v-col>

      <v-col v-if="creating" cols="12">
       <file-upload-button
           @fileSelected="onFileSelected"
           :maxFileSize="maxFileSize"
           :loading="loading"
       ></file-upload-button>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>

import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'

import {DateInput} from '@dracul/dayjs-frontend';

import UserStorageProvider from "../../../providers/UserStorageProvider"
import FileUploadButton from "../../../components/FileUploadButton";
import { GroupAutocomplete, UserAutocomplete } from '@dracul/user-frontend'

export default {
  name: "FileForm",
  mixins: [InputErrorsByProps, RequiredRule],
  components: {FileUploadButton, DateInput, GroupAutocomplete, UserAutocomplete},
  props: {
    value: {type: Object, required: true},
    creating: {type: Boolean, default: false},
    loading: {type: Boolean, default: false}
  },
  data() {
    return {
      maxFileSize: null,
      fileExpirationTime: null,
      fileExpirationTimeRules: [
        () => {
          if (this.differenceInDays < 0) {
            return this.$t("media.userStorage.fileExpirationTimeOlderThanToday")
          } else if (this.fileExpirationTime && this.differenceInDays) {
            return (this.differenceInDays < this.fileExpirationTime)
                || `${this.$t("media.userStorage.fileExpirationLimitExceeded")} ${this.fileExpirationTime} ${this.$t("media.file.days")}`
          } else {
            return true
          }
        }
      ],
    }
  },

  mounted() {
    this.findUserStorage();
  },
  computed: {
    form: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    differenceInDays() {
      if(this.form.expirationDate){
        const today = new Date();
        const expirationDate = new Date(this.form.expirationDate);
        return Math.floor((expirationDate - today) / (1000 * 3600 * 24))
      }
      return null
    }
  },
  watch: {
    form: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    },
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    onFileSelected(file){
      this.$emit('fileSelected', file)
    },
    findUserStorage() {
      return UserStorageProvider.findUserStorageByUser().then((res) => {
        if (res.data.userStorageFindByUser && res.data.userStorageFindByUser.maxFileSize) {
          this.maxFileSize = res.data.userStorageFindByUser.maxFileSize;
          this.fileExpirationTime = res.data.userStorageFindByUser.fileExpirationTime;
        }
      }).catch(
          err => console.error(err)
      )
    }
  }
}
</script>

<style scoped>

</style>


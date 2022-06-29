<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <date-input
            v-model="expirationDate"
            :label="$t('media.file.expirationDate')"
            prepend-icon="event"
            color="secondary"
            hide-details
            :rules="fileExpirationTimeRules"/>
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <v-select
          prepend-icon="visibility"
          v-model="isPublic"
          :items="[{text: 'Público', value: true}, {text: 'Privado', value: false}]"
          :label="$t('media.file.visibility')"
        ></v-select>
      </v-col>

      <v-col cols="12" sm="12" md="12" >
          <v-combobox
              prepend-icon="loyalty"
              v-model="tags"
              :label="$t('media.file.tags')"
              multiple
              chips
              color="secondary"
              item-color="secondary"
          ></v-combobox>
      </v-col>

      <v-col cols="12" sm="12" md="12" >
        <v-text-field
            prepend-icon="description"
            name="filename"
            v-model="description"
            :label="$t('media.file.description')"
            :placeholder="$t('media.file.description')"
            color="secondary"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-container class="mb-0 pb-0">
      <input type="file"
        style="display: none"
        ref="file"
        :accept="accept"
        @change="onFilePicked"
        :disabled="disableUploadButton"
      />

      <v-menu
          v-model="showErrorMessage"
          :nudge-width="200"
          :close-on-content-click="false"
          :close-on-click="false"
          offset-x
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on:click="pickFile()"
                fab dark
                :color="getState.color"
                :loading="loading"
                :x-large="xLarge"
                v-bind="attrs"
          >
            <v-avatar v-if="isImage">
              <img :src="getSrc" alt="image"/>
            </v-avatar>
            <v-icon v-else-if="isAudio">headset</v-icon>
            <v-icon v-else-if="isVideo">videocam</v-icon>
            <v-icon v-else>{{ getState.icon }}</v-icon>
          </v-btn>
        </template>

        <v-card :style="{width: '280px'}" elevation="0">
          <v-card-text class="pb-0 pa-0">
            <v-alert class="mb-0" border="left" type="error" text outlined tile>
              {{ errorMessage }}
            </v-alert>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn text color="primary" v-on:click="resetUpload" class="ml-2">OK</v-btn>
          </v-card-actions>
        </v-card>

      </v-menu>

      <p class="mb-0 mt-5">{{(this.file) == null ? $t('media.file.chooseFile') : this.file.name}}</p>
    </v-container>
  </v-container>
</template>

<script>
import uploadProvider from "../../providers/UploadProvider";
import UserStorageProvider from "../../../media/providers/UserStorageProvider"
import {DateInput} from '@dracul/dayjs-frontend';

const INITIAL = 'initial'
const SELECTED = 'selected'
const UPLOADED = 'uploaded'
const ERROR = 'error'

export default {
  name: "FileUploadExpiration",
  components: {DateInput},
  props: {
    autoSubmit: {type: Boolean, default: false},
    accept: {type: String, default: '*'},
    xLarge: {type: Boolean, default: false},
  },
  data() {
    return {
      dialog: false,
      dialogTitle: null,
      title: 'media.file.creating',
      errorMessage: null,
      showErrorMessage: null,
      inputErrors: {},
      file: null,
      color: 'blue-grey',
      icon: 'cloud_upload',
      type: null,
      uploadedFile: null,
      state: INITIAL,
      maxFileSize: 0,
      expirationDate: null,
      fileExpirationTime: null,
      disableUploadButton: false,
      states: {
        initial: {
          color: 'blue-grey',
          icon: 'cloud_upload'
        },
        selected: {
          color: 'cyan darken-3',
          icon: 'publish'
        },
        loading: {
          color: 'amber darken-3',
          icon: ''
        },
        uploaded: {
          color: 'green darken-3',
          icon: 'zoom_in'
        },
        error: {
          color: 'red darken-3',
          icon: 'error'
        },
      },
      isPublic: false,
      description: null,
      loading: false,
      fileExpirationTimeRules: [
        () => {
          this.disableUploadButton = true;
          if (this.getDifferenceInDays < 0) {
            return this.$t("media.userStorage.fileExpirationTimeOlderThanToday")
          } else if (this.fileExpirationTime && this.getDifferenceInDays && this.getDifferenceInDays >= this.fileExpirationTime) {
            return `${this.$t("media.userStorage.fileExpirationLimitExceeded")} ${this.fileExpirationTime} ${this.$t("media.file.days")}`
          }
          this.disableUploadButton = false;
          return true
        }
      ],
      tags: []
    }
  },
  computed: {
    getState() {
      if (this.loading) return this.states.loading
      return this.states[this.state]
    },
    isImage() {
      return !!(this.uploadedFile && this.uploadedFile.type === 'image')
    },
    isAudio() {
      return !!(this.uploadedFile && this.uploadedFile.type === 'audio')
    },
    isVideo() {
      return !!(this.uploadedFile && this.uploadedFile.type === 'video')
    },
    getSrc() {
      if (this.uploadedFile && this.uploadedFile.url) {
        return this.uploadedFile.url
      }
      return null
    },
    getDifferenceInDays() {
      if (this.expirationDate) {
        const today = new Date();
        const expirationDate = new Date(this.expirationDate);
        return Math.floor((expirationDate - today) / (1000 * 3600 * 24));
      }
      return null;
    }
  },
  mounted() {
    this.findUserStorage();
  },
  methods: {
    pickFile() {
      if (this.state === INITIAL) {
        this.$refs.file.click()
      } else if (this.state === SELECTED) {
        this.upload()
      } else if (this.state === UPLOADED || this.state === ERROR) {
        this.dialog = true
      }
    },
    onFilePicked: function (e) {
      this.file = e.target.files[0]
      this.state = SELECTED
      const fileSize = e.target.files[0].size ? e.target.files[0].size / (1024 * 1024) : null;
      this.$emit('filePicked', fileSize);
      if (this.autoSubmit) {
        this.upload(fileSize)
      }
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
    },
     async upload(fileSize) {
      if (this.file && this.state !== UPLOADED && fileSize <= this.maxFileSize && this.getDifferenceInDays <= this.fileExpirationTime) {
        this.loading = true;
        let expirationDateWithMinutes = this.expirationDate ? this.addHoursMinutesSecondsToDate(this.expirationDate) : null;

        await uploadProvider.uploadFile(this.file, expirationDateWithMinutes, this.isPublic, this.description, this.tags).then(result => {
          this.uploadedFile = result.data.fileUpload;
          this.setState(UPLOADED);

        }).catch((err) => {
          console.log("ERROR", err)
          this.setState(ERROR);
          this.setErrorMessage(err.message);
          this.showErrorMessage = true;

        }).finally(() => this.loading = false);
        this.$emit('fileUploaded', this.uploadedFile);
        return this.uploadedFile;
      } else {
        this.setErrorFileExceeded();
      }
    },
    addHoursMinutesSecondsToDate(date) {
      let today = new Date();
      let expirationDate = new Date(date)
      expirationDate.setHours(today.getHours());
      expirationDate.setMinutes(today.getMinutes());
      expirationDate.setSeconds(today.getSeconds());
      return expirationDate.toString();
    },
    resetUpload() {
      this.showErrorMessage = false;
      this.setState(INITIAL);
    },
    setErrorFileExceeded() {
      this.setState(ERROR);
      this.setErrorMessage(`${this.$t("media.file.fileSizeExceeded")} ${this.maxFileSize} Mb`);
      this.showErrorMessage = true;
    },
    setState(state) {
      this.state = state;
    },
    setErrorMessage(errorMessage) {
      this.errorMessage = errorMessage;
    }
  }
}
</script>

<style scoped>

</style>

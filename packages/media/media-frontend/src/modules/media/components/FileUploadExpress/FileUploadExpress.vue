<template>
  <div>

    <v-row>

      <v-col cols="12" sm="6" md="4" class="mt-3"  >
        <h3>Fecha de expiración (opcional):</h3>
      </v-col>

      <v-col cols="12" sm="6" md="4" class="pt-0" >
        <date-input
          v-model="expirationDate"
          :label="$t('media.file.expirationDate')"
          prepend-icon="event"
          color="secondary"
          hide-details
          :rules="fileExpirationTimeRules"
        />
      </v-col>

    </v-row>

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
         <v-btn v-on:click="pickFile(); on"
                fab dark
                :color="getState.color"
                :loading="loading"
                :x-large="xLarge"
                v-bind="attrs"
          >
            <v-avatar v-if="isImage">
              <img :src="getSrc"/>
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
           <!-- <v-spacer></v-spacer> -->
          <v-btn text color="primary" v-on:click="resetUpload" class="ml-2">OK</v-btn>
        </v-card-actions>
      </v-card>
      
    </v-menu>
    
  </div>
</template>

<script>
import uploadProvider from "../../providers/UploadProvider";
import UserStorageProvider from "../../../media/providers/UserStorageProvider"
import { DateInput } from '@dracul/dayjs-frontend';

const INITIAL = 'initial'
const SELECTED = 'selected'
const UPLOADED = 'uploaded'
const ERROR = 'error'

export default {
  name: "FileUploadExpress",
  components: { DateInput},
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
      maxFileSize:0,
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
        }
      },
      loading: false,
      fileExpirationTimeRules: [
        () => {
          this.disableUploadButton = true;
          if (this.getDifferenceInDays < 0) {
            return this.$t("media.userStorage.fileExpirationTimeOlderThanToday")
          }
          else if (this.fileExpirationTime && this.getDifferenceInDays && this.getDifferenceInDays >= this.fileExpirationTime) {
            return `${this.$t("media.userStorage.fileExpirationLimitExceeded")} ${this.fileExpirationTime} ${this.$t("media.file.days")}`
          } 
          this.disableUploadButton = false;
          return true
        }
      ]
    }
  },
  computed: {
    getState() {
      if (this.loading) return this.states.loading
      return this.states[this.state]
    },
    isImage() {
      return (this.uploadedFile && this.uploadedFile.type === 'image') ? true : false
    },
    isAudio() {
      return (this.uploadedFile && this.uploadedFile.type === 'audio') ? true : false
    },
    isVideo() {
      return (this.uploadedFile && this.uploadedFile.type === 'video') ? true : false
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
        return Math.floor((expirationDate - today)/(1000 * 3600 * 24));
      }
      return null;
    }
  },
  mounted () {
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
      const fileSize = e.target.files[0].size?e.target.files[0].size/(1024*1024):null;
      if (this.autoSubmit) {
        this.upload(fileSize)
      }
    },
    findUserStorage() {
      return UserStorageProvider.findUserStorageByUser().then((res)  => {
        if(res.data.userStorageFindByUser && res.data.userStorageFindByUser.maxFileSize){
          this.maxFileSize = res.data.userStorageFindByUser.maxFileSize;
          this.fileExpirationTime = res.data.userStorageFindByUser.fileExpirationTime;
        }

      }).catch(
          err => console.error(err)
      )
    },
    upload(fileSize) {
      if (this.file && this.state != UPLOADED && fileSize <= this.maxFileSize && this.getDifferenceInDays <= this.fileExpirationTime) {
        this.loading = true;
        let expirationDateWithMinutes = this.expirationDate ? this.addHoursMinutesSecondsToDate(this.expirationDate) : null

        uploadProvider.uploadFile(this.file, expirationDateWithMinutes).then(result => {
          this.uploadedFile = result.data.fileUpload
          this.setState(UPLOADED);
          this.$emit('fileUploaded', result.data.fileUpload)
        }).catch(() => {
          this.setErrorFileExceeded();
        }).finally(() => this.loading = false)
      } else{
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

.v-menu__content {
  margin-left: 4px !important;
  z-index: 1;
}

</style>

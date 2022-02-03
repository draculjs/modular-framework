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

    <v-btn v-on:click="pickFile"
           class="mx-3"
           fab dark
           :color="getState.color"
           :loading="loading"
           :x-large="xLarge"
    >
      <v-avatar v-if="isImage">
        <img :src="getSrc"/>
      </v-avatar>
      <v-icon v-else-if="isAudio">headset</v-icon>
      <v-icon v-else-if="isVideo">videocam</v-icon>
      <v-icon v-else>{{ getState.icon }}</v-icon>
    </v-btn>

    <input type="file"
           style="display: none"
           ref="file"
           :accept="accept"
           @change="onFilePicked"
    />

    <v-dialog v-if="dialog" v-model="dialog" max-width="800">
      <v-card>
        <toolbar-dialog :title="dialogTitle" @close="dialog=false"></toolbar-dialog>
        <v-card-text  v-if="!!errorMessage">
          <v-alert type="error" outlined tile>
            {{ $t(errorMessage) }}
          </v-alert>
        </v-card-text>

        <v-card-text>
          <file-view :file="uploadedFile"></file-view>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import uploadProvider from "../../providers/UploadProvider";
import { ToolbarDialog} from '@dracul/common-frontend'
import FileView from "../FileView/FileView";
import UserStorageProvider from "../../../media/providers/UserStorageProvider"
import { DateInput } from '@dracul/dayjs-frontend';

const INITIAL = 'initial'
const SELECTED = 'selected'
const UPLOADED = 'uploaded'
const ERROR = 'error'

export default {
  name: "FileUploadExpress",
  components: { ToolbarDialog, DateInput, FileView},
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
      errorMessage: '',
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
          if (this.getFileExpirationTimeInput < 0) {
            return this.$t("media.userStorage.fileExpirationTimeOlderThanToday")
          }
          else if (this.fileExpirationTime && this.getFileExpirationTimeInput) {
            return (this.getFileExpirationTimeInput < this.fileExpirationTime) 
            || `${this.$t("media.userStorage.fileExpirationLimitExceeded")} ${this.fileExpirationTime} ${this.$t("media.file.days")}`
          } else {
            return true
          }
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
    getFileExpirationTimeInput() {
      if (this.expirationDate) {
        const today = new Date();
        const expirationDate = new Date(this.expirationDate);
        const differenceInDays = ((expirationDate - today)/(1000 * 3600 * 24)).toFixed(0);
        return differenceInDays;
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
      if (this.file && this.state != UPLOADED && fileSize <= this.maxFileSize && this.getFileExpirationTimeInput < this.fileExpirationTime) {
        this.loading = true;

        this.expirationDate = this.expirationDate ? this.addHoursMinutesSecondsToDate(this.expirationDate) : null;

        uploadProvider.uploadFile(this.file, this.expirationDate).then(result => {
          this.state = UPLOADED
          this.uploadedFile = result.data.fileUpload
          this.$emit('fileUploaded', result.data.fileUpload)
        }).catch(err => {
          console.log("ERROR", err)
          this.state = ERROR
          this.errorMessage = this.$t("media.file.fileSizeExceeded")

        }).finally(() => this.loading = false)
      }else{
        this.state = ERROR
        this.errorMessage = this.$t("media.file.fileSizeExceeded")
      }
    },
    addHoursMinutesSecondsToDate(date) {
      let today = new Date();
      let expirationDate = new Date(date)
      expirationDate.setHours(today.getHours());
      expirationDate.setMinutes(today.getMinutes());
      expirationDate.setSeconds(today.getSeconds());
      return expirationDate.toString();
    }
  }
}
</script>

<style scoped>

</style>

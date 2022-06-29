<template>
  <div>

    <input type="file"
           style="display: none"
           ref="file"
           :accept="accept"
           @change="onFilePicked"
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
  </div>
</template>

<script>
import uploadProvider from "../../providers/UploadProvider";
import UserStorageProvider from "../../../media/providers/UserStorageProvider"

const INITIAL = 'initial'
const SELECTED = 'selected'
const UPLOADED = 'uploaded'
const ERROR = 'error'

export default {
  name: "FileUploadExpress",
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
      showErrorMessage: false,
      errorMessage: '',
      inputErrors: {},
      file: null,
      color: 'blue-grey',
      icon: 'cloud_upload',
      type: null,
      uploadedFile: null,
      state: INITIAL,
      maxFileSize: 0,
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
      if (this.autoSubmit) {
        this.upload(fileSize)
      }
    },
    findUserStorage() {
      return UserStorageProvider.findUserStorageByUser().then((res) => {
        if (res.data.userStorageFindByUser && res.data.userStorageFindByUser.maxFileSize) {
          this.maxFileSize = res.data.userStorageFindByUser.maxFileSize;
        }

      }).catch(
          err => console.error(err)
      )
    },
    upload(fileSize) {
      if (this.file && this.state != UPLOADED && fileSize <= this.maxFileSize) {
        this.loading = true
        uploadProvider.uploadFile(this.file)
            .then(result => {
              this.setState(UPLOADED);
              this.uploadedFile = result.data.fileUpload
              this.$emit('fileUploaded', result.data.fileUpload)
            })
            .catch(err => {
              console.log("ERROR", err)
              this.setState(ERROR);
              this.setErrorMessage(err.message)
              this.showErrorMessage = true
            })
            .finally(() => this.loading = false)
      } else {
        this.setErrorFileExceeded()
      }
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

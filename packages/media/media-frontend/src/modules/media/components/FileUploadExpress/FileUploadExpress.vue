<template>
  <div>
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
        <v-text v-if="!!errorMessage">
          <v-alert type="error" outlined tile>
            {{ $t(errorMessage) }}
          </v-alert>
        </v-text>

        <v-card-text>
          <file-view :file="uploadedFile"></file-view>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import uploadProvider from "../../providers/UploadProvider";
import {ClientError, ToolbarDialog} from '@dracul/common-frontend'
import FileView from "../FileView/FileView";

const INITIAL = 'initial'
const SELECTED = 'selected'
const UPLOADED = 'uploaded'
const ERROR = 'error'

export default {
  name: "FileUploadExpress",
  components: {FileView, ToolbarDialog},
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
      const fileSize = e.target.files[0].size;
      if (this.autoSubmit) {
        this.upload(fileSize)
      }
    },
    upload(fileSize) {
      if (this.file && this.state != UPLOADED) {
        this.loading = true
        uploadProvider.uploadFile(this.file, fileSize.toString()).then(result => {
          this.state = UPLOADED
          this.uploadedFile = result.data.fileUpload
          this.$emit('fileUploaded', result.data.fileUpload)
        }).catch(err => {
          this.state = ERROR
          let clientError = new ClientError(err)
          this.errorMessage = clientError.i18nMessage
        }).finally(() => this.loading = false)
      }
    }
  }
}
</script>

<style scoped>

</style>

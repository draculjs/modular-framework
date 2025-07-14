<template>
  <div class="d-flex flex-column align-center">
    <input type="file"
           style="display: none"
           ref="file"
           :accept="accept"
           @change="onFilePicked"
    />
    <v-btn v-on:click="pickFile()"
           fab dark
           :color="getState.color"
           :loading="loading"
           :x-large="xLarge"
    >
      <v-avatar v-if="isImage">
        <img :src="getSrc" alt="image"/>
      </v-avatar>

      <v-icon v-else-if="isAudio">headset</v-icon>
      <v-icon v-else-if="isVideo">videocam</v-icon>
      <v-icon v-else>{{ getState.icon }}</v-icon>
    </v-btn>

    <p class="mb-0 mt-5">{{ !this.file ? $t('media.file.chooseFile') : this.file.name}}</p>


    <v-alert v-if="invalidSize" class="mb-0" border="left" type="error" text outlined tile>
      {{ $t("media.file.fileSizeExceeded") }} {{maxFileSize}} Mb
      <v-btn text color="primary" v-on:click="resetUpload" class="ml-2">OK</v-btn>
    </v-alert>

    <v-alert v-if="invalidExtension" class="mb-0" border="left" type="error" text outlined tile>
      El nuevo fichero debe tener la misma extension que el original
      <v-btn text color="primary" v-on:click="resetUpload" class="ml-2">OK</v-btn>
    </v-alert>

  </div>
</template>

<script>


export default {
  name: "FileUploadButton",
  props: {
    accept: {type: String, default: '*'},
    loading: {type: Boolean, default: false},
    xLarge: {type: Boolean, default: false},
    maxFileSize: {type: Number, default: 0},
    errorMessage: {type: String},
    uploadedFile: {type: Object},
    updating: {type: Boolean, default: false},
    oldFileExtension: {type: String},
  },
  data() {
    return {
      file: null,
      invalidSize: false,
      invalidExtension: false,
    }
  },
  computed: {
    isSelected() {
      return !!this.file
    },
    getState() {
      if (this.loading) return this.states.loading
      if (this.errorMessage) return this.states.error
      if (this.uploadedFile) return this.states.uploaded
      if (this.isSelected) return this.states.selected
      return this.states.initial
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
      return (this.uploadedFile && this.uploadedFile.url) ? this.uploadedFile.url : null
    },
    states() {
      return {
        initial: {
          color: 'blue-grey',
          icon: 'mdi-upload'
        },
        selected: {
          color: 'cyan darken-3',
          icon: 'mdi-cloud-check-outline'
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
      }
    }
  },
  methods: {
    pickFile() {
        this.$refs.file.click()
    },
    validateSize() {
      const fileSize = (this.file && this.file.size) ? this.file.size / (1024 * 1024) : null;
      if (fileSize > this.maxFileSize) {
        this.invalidSize = true
      }
    },
    async validateExtension() {
      const newFileExtension = '.' + this.file.name.split('.').pop()
      if (this.oldFileExtension != newFileExtension) {
        this.invalidExtension = true
        this.file = null
      }else{
        this.invalidExtension = false
      }
    },
    onFilePicked: function (e) {
      this.file = e.target.files[0]

      this.validateSize()
      if (this.updating) this.validateExtension()

      this.$emit('fileSelected', this.file)
    },
    resetUpload() {
      this.file = null
      this.invalidSize = false
      this.invalidExtension = false
    },

  }
}
</script>

<style scoped>

</style>

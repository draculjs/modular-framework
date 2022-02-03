<template>
  <crud-show :open="open"
             :loading="loading"
             :title="title"
             :errorMessage="errorMessage"
             @close="$emit('close')"
  >
    <div class="text-center">
      <file-upload-express v-if="!file" ref="form"
                           autoSubmit
                           x-large
                           @fileUploaded="fileUploaded"
      />

      <file-view v-if="file" :file="file"/>
    </div>

  </crud-show>
</template>

<script>


import {CrudShow} from '@dracul/common-frontend'

import FileUploadExpress from "../../../components/FileUploadExpress/FileUploadExpress";
import FileView from "../../../components/FileView/FileView";

export default {
  name: "FileCreate",

  components: {FileView, FileUploadExpress, CrudShow},

  props: {
    open: {type: Boolean, default: true}
  },

  data() {
    return {
      title: 'media.file.creating',
      errorMessage: '',
      inputErrors: {},
      loading: false,
      file: null,
      form: {
        filename: '',
        extension: '',
        relativePath: '',
        absolutePath: '',
        size: '',
        url: '',
      }
    }
  },

  methods: {
    create() {
      this.$refs.form.upload()

    },
    fileUploaded(file) {
      this.file = file
      this.$emit('itemCreated')
    },

  },
}
</script>

<style scoped>

</style>


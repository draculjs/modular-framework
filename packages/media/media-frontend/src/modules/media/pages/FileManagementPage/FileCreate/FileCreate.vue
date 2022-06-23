<template>
  <add-and-close-crud-show 
    :open="open"
      :loading="loading"
      :title="title"
      :errorMessage="errorMessage"
      @close="$emit('close')"
      @createFile="fileUploaded"
      :filePicked="this.filePicked"
      ref="crudShow"
  >
    <div class="text-center">
      <file-upload-expiration v-if="!file" ref="form"
          x-large
          @filePicked="filePickedHandler"
      />

      <file-view v-if="file" :file="file"/>
    </div>

  </add-and-close-crud-show >
</template>

<script>


import {addAndCloseCrudShow} from '../../../../../../node_modules/@dracul/common-frontend/src/components/Crud/CrudShow/addAndCloseCrudShow'

import FileUploadExpiration from "../../../components/FileUploadExpiration/FileUploadExpiration";
import FileView from "../../../components/FileView/FileView";

export default {
  name: "FileCreate",

  components: {FileView, FileUploadExpiration, addAndCloseCrudShow},

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
      },
      filePicked : false,
      pickedFileSize : null,

    }
  },

  methods: {
    create() {
      this.$refs.form.upload()

    },
    async fileUploaded() {
      this.file = await this.$refs.form.upload(this.pickedFileSize);

      let succesfully = false;
      if(this.$refs.form.state !== 'error') succesfully = true;
      await this.$refs.crudShow.fileWasCreated();
      
      this.$emit('itemCreated', succesfully);
    },

    filePickedHandler(fileSize){
      this.pickedFileSize = fileSize;
      this.filePicked = true;    
    }

  },
}
</script>

<style scoped>

</style>


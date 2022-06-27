<template>
  <crud-show
      :open="open"
      :loading="loading"
      :title="title"
      :errorMessage="errorMessage"
      @close="$emit('close')"
      @createFile="fileUploaded"
      :filePicked="this.filePicked"
      :showSubmitButton="showSubmitButton"
  >

    <template v-slot:submitButton>
      <v-btn text color="secondary" @click="fileUploaded">{{succesButtonText}}</v-btn>
    </template>

    <div class="text-center">
      <file-upload-expiration v-if="!file" ref="form"
          x-large
          @filePicked="filePickedHandler"
      />

      <file-view v-if="file" :file="file"/>
    </div>

  </crud-show>
</template>

<script>


// import {CrudShow} from "@dracul/common-frontend";
import {CrudShow} from '../../../../../../../../common/common-frontend/src/components/Crud/CrudShow';

import FileUploadExpiration from "../../../components/FileUploadExpiration/FileUploadExpiration";
import FileView from "../../../components/FileView/FileView";

export default {
  name: "FileCreate",
  components: {FileView, FileUploadExpiration, CrudShow},
  props: {
    open: {type: Boolean, default: true},
    succesButtonText: {type: String, default: 'Crear'},
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
      filePicked: false,
      pickedFileSize: null,
      showSubmitButton: true
    }
  },
  methods: {
    create() {
      this.$refs.form.upload()

    },
    async fileUploaded() {
      this.file = await this.$refs.form.upload(this.pickedFileSize);

      let succesfully = false;
      if(this.$refs.form.state !== 'error'){
        succesfully = true;
        this.showSubmitButton = false;
      }

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

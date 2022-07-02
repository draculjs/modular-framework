<template>

  <crud-show v-if="uploadedFile"  :open="open" :title="title" @close="$emit('close')">
    <file-view v-if="uploadedFile" :file="uploadedFile"/>
  </crud-show>

  <crud-create
      v-else
      :open="open"
      :loading="loading"
      :title="title"
      :errorMessage="errorMessage"
      @close="$emit('close')"
      @create="onCreate"
      :fullscreen="false"
  >

    <div class="text-center">

      <file-form
          v-model="form"
          :input-errors="inputErrors"
          ref="form"
          @fileSelected="onFileSelected"
          creating
      />

    </div>

  </crud-create>


</template>

<script>

import {CrudCreate, CrudShow} from "@dracul/common-frontend";
import FileView from "../../../components/FileView/FileView";
import FileForm from "../FileForm";
import uploadProvider from "../../../providers/UploadProvider";

export default {
  name: "FileCreate",
  components: {FileForm, FileView, CrudCreate, CrudShow},
  props: {
    open: {type: Boolean, default: true},
  },
  mounted() {
    console.log("uploadedFile", this.uploadedFile)
  },
  data() {
    return {
      title: 'media.file.creating',
      errorMessage: '',
      inputErrors: {},
      loading: false,
      form: {
        file: null,
        expirationDate: null,
        isPublic: false,
        description: '',
        tags:[]
      },
      uploadedFile: null
    }
  },
  methods: {
    onFileSelected(file) {
      this.form.file = file
    },
    async onCreate() {
      if (this.form.file) {
        this.loading = true;

        await uploadProvider.uploadFile(
            this.form.file,
            this.form.expirationDate,
            this.form.isPublic,
            this.form.description,
            this.form.tags)
            .then(result => {
              this.uploadedFile = result.data.fileUpload
              this.$emit('itemCreated')
              //this.$emit('close')
            })
            .catch((err) => {
              console.log("UploadFile ERROR", err)
              this.errorMessage = err.message
            })
            .finally(() => this.loading = false)

      }
    }
  }
}
</script>

<style scoped>

</style>

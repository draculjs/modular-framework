<template>
  <crud-create
      :open="open"
      :loading="loading"
      :title="title"
      :errorMessage="errorMessage"
      @close="$emit('close')"
      @create="create"
  >

    <div class="text-center">

      <file-view v-if="uploadedFile" :file="uploadedFile"/>

      <file-form
          v-else
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

import {CrudCreate} from "@dracul/common-frontend";
import FileView from "../../../components/FileView/FileView";
import FileForm from "@/modules/media/pages/FileManagementPage/FileForm/FileForm";
import uploadProvider from "@/modules/media/providers/UploadProvider";

export default {
  name: "FileCreate",
  components: {FileForm, FileView, CrudCreate},
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
    async create() {
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
              this.$emit('close')
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

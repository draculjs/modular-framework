<template>
  <crud-update 
    :open="open"
    :loading="loading"
    :title="title"
    :errorMessage="errorMessage"
    :disableSubmit="!hasChanges"
    @update="update"
    @close="$emit('close')"
  >

    <v-card flat class="mb-3">
      <v-card-text>
        <file-form
            updating
            :oldFileExtension="this.oldFileExtension"
            ref="form"
            v-model="form"
            :input-errors="inputErrors"
            @fileSelected="handleFileSelected"
        />
      </v-card-text>
    </v-card>

  </crud-update>
</template>

<script>
import FileProvider from "../../../providers/FileProvider";
import {CrudUpdate, ClientError} from '@dracul/common-frontend'
import FileForm from "../FileForm";

export default {
  name: "FileUpdate",
  components: {FileForm, CrudUpdate},
  props: {
    open: {type: Boolean, default: true},
    item: {type: Object, required: true}
  },
  data() {
    return {
      title: 'media.file.editing',
      errorMessage: '',
      inputErrors: {},
      loading: false,
      form: {
        id: this.item.id,
        description: this.item.description,
        tags: this.item.tags,
        expirationDate: this.item.expirationDate,
        isPublic: this.item.isPublic ? this.item.isPublic : false,
        groups: this.item.groups ? this.item.groups : [],
        users: this.item.users ? this.item.users : []
      },
      file: null,
      oldFileExtension: this.item.extension,
      initialForm: null,
      hasFileSelected: false,
    }
  },
  created() {
    this.initialForm = JSON.parse(JSON.stringify(this.form))
  },
  computed: {
    hasFormChanges() {
      return JSON.stringify(this.form) !== JSON.stringify(this.initialForm)
    },
    hasChanges() {
      return this.hasFormChanges || this.hasFileSelected
    }
  },
  methods: {
    update() {
      if (this.$refs.form.validate()) {
        this.loading = true
        FileProvider.updateFile(this.form, this.file).then(r => {
              if (r) {
                this.$emit('itemUpdated', r.data.fileUpdate)
                this.$emit('close')
              }
            }
        ).catch(error => {
          let clientError = new ClientError(error)
          this.inputErrors = clientError.inputErrors
          this.errorMessage = clientError.i18nMessage
        }).finally(() => this.loading = false)
      }
    },
    async handleFileSelected(file){
      if(file){
        await file
        const newFileExtension = '.' + file.name.split('.').pop()

        if (newFileExtension == this.oldFileExtension) {
          this.file = file
          this.hasFileSelected = true
        }
      } else {
        this.file = null
        this.hasFileSelected = false
      }
    }
  },
}
</script>

<style scoped>

</style>


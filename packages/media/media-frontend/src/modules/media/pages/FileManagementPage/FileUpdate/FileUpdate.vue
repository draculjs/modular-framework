<template>
  <crud-update :open="open"
               :loading="loading"
               :title="title"
               :errorMessage="errorMessage"
               @update="update"
               @close="$emit('close')"
  >

    <v-card flat class="mb-3">
      <v-card-text>
        <file-form
            ref="form"
            v-model="form"
            :input-errors="inputErrors"
        />
      </v-card-text>
    </v-card>

    <file-view :file="item"></file-view>

  </crud-update>
</template>

<script>
import FileProvider from "../../../providers/FileProvider";
import {CrudUpdate, ClientError} from '@dracul/common-frontend'
import FileForm from "../FileForm";
import FileView from "../../../components/FileView/FileView";

export default {
  name: "FileUpdate",
  components: {FileView, FileForm, CrudUpdate},
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
        groups: this.item.groups ? this.item.group : [],
        users: this.item.users ? this.item.users : []
      }
    }
  },
  methods: {
    update() {
      if (this.$refs.form.validate()) {
        this.loading = true
        FileProvider.updateFile(this.form).then(r => {
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
    }
  },
}
</script>

<style scoped>

</style>


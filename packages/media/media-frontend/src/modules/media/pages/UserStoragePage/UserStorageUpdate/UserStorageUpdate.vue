<template>
  <crud-update :open="open"
               :loading="loading"
               :title="title"
               :errorMessage="errorMessage"
               @update="save"
               @close="$emit('close')"
  >
    <v-alert v-if="formError" type="error">{{ formError }}</v-alert>
    <user-storage-form ref="form" v-model="form"
                       :fileSizeLimit="fileSizeLimitComputed"
                       :fileExpirationLimit="fileExpirationLimit"
                       :input-errors="inputErrors"
                       @submit.prevent="save">

    </user-storage-form>
  </crud-update>
</template>

<script>
import {CrudUpdate} from '@dracul/common-frontend'
import UserStorageForm from '../UserStorageForm/UserStorageForm.vue';
import UserStorageProvider from '../../../providers/UserStorageProvider'


export default {
  name: "UserStorageUpdate",
  components: {CrudUpdate, UserStorageForm},
  props: {
    userStorageForm: Object,
    open: {type: Boolean, default: true}
  },
  data() {
    return {
      title: this.$t("media.userStorage.editTitle"),
      errorMessage: "",
      inputErrors: {},
      loading: false,
      formError: null,
      form: {
        id: this.userStorageForm.id,
        name: this.userStorageForm.user.name,
        capacity: this.userStorageForm.capacity,
        usedSpace: this.userStorageForm.usedSpace,
        maxFileSize: this.userStorageForm.maxFileSize,
        fileExpirationTime: this.userStorageForm.fileExpirationTime,
        deleteByLastAccess: this.userStorageForm.deleteByLastAccess,
        deleteByCreatedAt: this.userStorageForm.deleteByCreatedAt
      },
      fileSizeLimit: 0,
      fileExpirationLimit: 0,
    };
  },
  created() {
    this.fetchMediaVariables()
  },
  methods: {
    save() {
      this.formError = null
      if (this.isFormValid()) {
        UserStorageProvider.updateUserStorage(this.form).then(
            this.$emit("roleUpdated"),
            this.$emit("close")
        ).catch(
            err => console.error(err)
        )
      } else {
        this.formError = "Valores Invalidos"
        console.warn("Valores Invalidos")
      }
    },
    fetchMediaVariables() {
      return UserStorageProvider.fetchMediaVariables().then((res) => {
        this.fileSizeLimit = res.data.fetchMediaVariables.maxFileSize;
        this.fileExpirationLimit = res.data.fetchMediaVariables.fileExpirationTime;
      }).catch(
          err => console.error(err)
      )
    },
    isFormValid() {
      this.form.capacity = parseFloat(this.form.capacity)
      this.form.maxFileSize = parseFloat(this.form.maxFileSize)
      this.form.fileExpirationTime = parseInt(this.form.fileExpirationTime)

      return this.form.capacity >= 0 && this.form.maxFileSize > 0 && this.form.fileExpirationTime > 0 &&
          this.form.capacity > this.form.usedSpace && this.fileSizeLimit >= this.form.maxFileSize &&
          this.fileExpirationLimit >= this.form.fileExpirationTime;
    }
  },
  computed: {
    fileSizeLimitComputed() {
      return this.fileSizeLimit
    }
  }
};
</script>

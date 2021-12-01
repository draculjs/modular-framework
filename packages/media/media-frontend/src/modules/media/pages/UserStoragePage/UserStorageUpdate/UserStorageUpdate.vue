<template>
    <crud-update :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @update="save"
                 @close="$emit('close')"
    >
        <user-storage-form ref="form" v-model="form" :fileSizeLimit="fileSizeLimitComputed" :fileExpirationLimit="fileExpirationLimit" :input-errors="inputErrors" @submit.prevent="save"></user-storage-form>
    </crud-update>
</template>

<script>
    import {CrudUpdate} from '@dracul/common-frontend'
    import UserStorageForm from '../UserStorageForm/UserStorageForm.vue';
    import UserStorageProvider from '../../../providers/UserStorageProvider'
    import baseProvider from '../../../../base/providers/BaseProvider';


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
            this.fetchEnvironmentVariables()
        },
        methods: {
            save() {
                if (this.isFormValid()) {
                    UserStorageProvider.updateUserStorage(this.form).then(
                        this.$emit("roleUpdated"),
                        this.$emit("close")
                    ).catch(
                        err => console.error(err)
                    )
                }
            },
            fetchEnvironmentVariables() {
                return baseProvider.fetchEnvironmentVariables().then((res)  => {
                    this.fileSizeLimit = res.data.fetchEnvironmentVariables.maxFileSize;
                    this.fileExpirationLimit = res.data.fetchEnvironmentVariables.fileExpirationTime;
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
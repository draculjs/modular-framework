<template>
    <crud-update :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @update="save"
                 @close="$emit('close')"
    >
        <user-storage-form ref="form" v-model="form" :fileSizeLimit="fileSizeLimit" :input-errors="inputErrors" @submit.prevent="save"></user-storage-form>
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
                },
                fileSizeLimit: 0
            };
        },
        mounted() {
            this.fetchMaxFileSize()
        },
        methods: {
            save() {
                this.form.capacity = parseFloat(this.form.capacity)
                this.form.maxFileSize = parseFloat(this.form.maxFileSize)
                if (this.form.capacity > this.form.usedSpace && this.fileSizeLimit >= this.form.maxFileSize){
                    UserStorageProvider.updateUserStorage(this.form).then(
                        this.$emit("roleUpdated"),
                        this.$emit("close")
                    ).catch(
                        err => console.error(err)
                    )
                }
            },
            fetchMaxFileSize() {
                return baseProvider.fetchMaxFileSize().then((res)  => {
                    this.fileSizeLimit = res.data.fetchMaxFileSize.maxFileSize;
                }).catch(
                    err => console.error(err)
                )
            }
        }
    };
</script>
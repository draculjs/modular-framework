<template>
    <crud-update :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @update="save"
                 @close="$emit('close')"
    >
        <user-storage-form ref="form" v-model="form" :input-errors="inputErrors"></user-storage-form>
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
                form: {
                    id: this.userStorageForm.id,
                    name: this.userStorageForm.user.name,
                    capacity: this.userStorageForm.capacity,
                    usedSpace: this.userStorageForm.usedSpace,
                }
            };
        },
        methods: {
            save() {
                UserStorageProvider.updateUserStorage(this.form).then(
                    this.$emit("roleUpdated"),
                    this.$emit("close")
                ).catch(
                    err => console.error(err)
                )
            },
        }
    };
</script>
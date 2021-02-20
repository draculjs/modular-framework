<template>
    <div>
        <v-alert :value="!!errorMessage" color="error" outlined>
            {{errorMessage}}
        </v-alert>

        <v-form ref="form" autocomplete="off">
            <input type="file" style="display: none" ref="img" accept="image/*" @change="onFilePicked"/>
        </v-form>
        <div @click="openFilePicker">
            <slot :loading="loading" />
        </div>
    </div>

</template>

<script>

    import UserProvider from "../../../../providers/UserProvider"

    export default {
        name: "UserAvatarForm",
        props: {
          user: {type:Object}
        },
        data: () => ({
            loading: false,
            errorMessage: null,
            img: null,
        }),
        methods: {
            uploadAvatar(file) {
                this.loading = true
                this.errorMessage = null
                UserProvider.adminAvatarUpload(this.user.id, file).then((response) => {
                    this.$emit('avatarUpdate', response.data.adminAvatarUpload.url)
                }).catch((err) => {
                    this.errorMessage = this.$t('error.'+err.message.replace('GraphQL error:', '').trim())
                }).finally(() => this.loading = false)
            },
            openFilePicker() {
                this.$refs.img.click()
            },
            onFilePicked: function (e) {
                this.img = e.target.files[0]
                if(this.img){
                    this.uploadAvatar(this.img)
                }
            }
        }
    }
</script>

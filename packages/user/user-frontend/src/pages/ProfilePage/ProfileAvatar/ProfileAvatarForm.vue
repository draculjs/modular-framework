<template>
    <div>
        <v-alert :value="errors.length?true:false" color="error" outlined>
            <ul>
                <li v-for="(error,i) in errors" :key="i">
                    {{error}}
                </li>
            </ul>
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

    import ProfileProvider from "../../../providers/ProfileProvider"
    import ClientError from "../../../errors/ClientError";

    export default {
        name: "ProfileAvatarForm",
        data: () => ({
            loading: false,
            errors: [],
            img: null,
        }),
        methods: {
            uploadAvatar(file) {
                this.loading = true
                ProfileProvider.avatarUpload(file).then((response) => {
                    this.$store.commit('avatarUpdate', response.data.avatarUpload.url)
                }).catch((err) => {
                    let clientError = new ClientError(err)
                    this.errors = clientError.inputErrors
                }).finally(() => this.loading = false)
            },
            openFilePicker() {
                this.$refs.img.click()
            },
            onFilePicked: function (e) {
                this.img = e.target.files[0]
                this.uploadAvatar(this.img)
            }
        }
    }
</script>

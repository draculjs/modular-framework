<template>
    <v-card outlined>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-btn v-on:click="pickFile"
                           class="mx-3"
                           fab dark
                           :color="color"
                           :loading="loading"
                    >
                        <v-icon>{{icon}}</v-icon>
                    </v-btn>
                    <input type="file"
                           style="display: none"
                           ref="file"
                           :accept="accept"
                           @change="onFilePicked"
                    />
                </v-col>

                <v-col v-if="file && file.name" cols="12" sm="12">
                    {{file.name}}
                </v-col>

                <v-col v-if="!!errorMessage" cols="12">
                    <v-alert type="error" outlined tile>
                        {{$t(errorMessage)}}
                    </v-alert>

                </v-col>

            </v-row>
        </v-card-text>
    </v-card>

</template>

<script>
    import uploadProvider from "../../providers/UploadProvider";
    import {ClientError} from '@dracul/common-frontend'

    export default {
        name: "FileUpload",
        props: {
            autoSubmit: {type: Boolean, default: false}
        },
        data() {
            return {
                title: 'media.file.creating',
                errorMessage: '',
                inputErrors: {},
                file: null,
                color: 'blue-grey',
                icon: 'cloud_upload',
                loading: false,
                result: null,
                accept: '*'
            }
        },
        methods: {
            pickFile() {
                this.$refs.file.click()
            },
            onFilePicked: function (e) {
                this.file = e.target.files[0]
                this.color = "green"
                this.icon = "publish"
                if (this.autoSubmit) {
                    this.upload()
                }
            },
            upload() {
                if (this.file) {
                    this.loading = true
                    uploadProvider.uploadFile(this.file).then(result => {
                        this.result = result
                        this.$emit('fileUploaded')
                    }).catch(err => {
                        let clientError = new ClientError(err)
                        this.errorMessage = clientError.i18nMessage
                    }).finally(() => this.loading = false)
                }
            }
        }
    }
</script>

<style scoped>

</style>
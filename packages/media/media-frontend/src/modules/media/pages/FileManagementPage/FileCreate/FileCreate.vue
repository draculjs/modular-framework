<template>
    <crud-create :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @create="create"
                 @close="$emit('close')"
    >
        <file-upload-express ref="form"
                     @fileUploaded="fileUploaded"
        />
    </crud-create>
</template>

<script>


    import {CrudCreate} from '@dracul/common-frontend'

    import FileUploadExpress from "../../../components/FileUploadExpress/FileUploadExpress";

    export default {
        name: "FileCreate",
         
        components: {FileUploadExpress, CrudCreate },
        
        props:{
          open: {type: Boolean, default: true}
        },
        
        data() {
            return {
                title: 'media.file.creating',
                errorMessage: '',
                inputErrors: {},
                loading: false,
                form: {
                    filename: '',
                    extension: '',
                    relativePath: '',
                    absolutePath: '',
                    size: '',
                    url: '',
                }
            }
        },
        
        methods: {
            create() {
               this.$refs.form.upload()

            },
            fileUploaded(){
                this.$emit('itemCreated')
                this.$emit('close')
            }

        },
    }
</script>

<style scoped>

</style>


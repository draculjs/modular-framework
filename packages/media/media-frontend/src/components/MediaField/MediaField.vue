<template>
  <v-row>
    <v-col class="flex-grow-1 flex-shrink-0">
      <v-text-field
          :prepend-icon="icon"
          :name="fieldName"
          v-model="field"
          :label="$te(label) ? $t(label) : label"
          :placeholder="label"
          :error="hasInputErrors(fieldName)"
          :error-messages="getInputErrors(fieldName)"
          color="secondary"
          :rules="isRequired ? required : []"
          :readonly="readOnly"
      ></v-text-field>
    </v-col>
    <v-col class="flex-shrink-0 flex-grow-0">
      <file-upload-express :accept="accept"
                           :auto-submit="true"
                           @fileUploaded="imageUploaded"
      />
    </v-col>


  </v-row>
</template>

<script>
import {InputErrorsByProps, RequiredRule} from "@dracul/common-frontend";
import FileUploadExpress from "../FileUploadExpress";

export default {
  name: "MediaField",
  components: {FileUploadExpress},
  mixins: [InputErrorsByProps, RequiredRule],
  props: {
    fieldName: {type: String, required: false, default: "file"},
    value: {type: String, required: true},
    label: {type: String, required: false, default: "media.file.chooseFile"},
    accept: {type: String, default: "*"},
    icon: {type: String, required: false, default: "attachment"},
    isRequired: {type: Boolean, default: false},
    readOnly: {type: Boolean,default: false},
  },
  computed: {
    field: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    form: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    imageUploaded(file) {
      this.$emit('fileUploaded', file)
      this.field = file.url
    },
  }
}
</script>

<style scoped>

</style>

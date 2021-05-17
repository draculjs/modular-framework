<template>
  <v-card outlined>

    <v-alert class="mx-3 mt-3" :value="!!errorMessage" color="error" dense text>
      {{ errorMessage }}
    </v-alert>

    <v-card-title>
      <div v-t="'customization.logo.title'"></div>
    </v-card-title>
    <v-card-subtitle v-t="'customization.logo.subtitle'">
    </v-card-subtitle>

    <v-card-text>
      <v-form ref="logoForm" autocomplete="off" @submit.prevent="saveLogo">

        <v-row>
          <v-col cols="12" sm="6" md="3" lg="3">
            <v-select
                prepend-icon="account_box"
                class="pa-3"
                :items="modes"
                :item-text="'name'"
                :item-value="'id'"
                v-model="formLogo.mode"
                color="secondary"
                item-color="secondary"
                :label="$t('customization.logo.form.mode')"
                required
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="3" lg="3">
            <v-text-field
                id="title"
                prepend-icon="title"
                name="title"
                :label="$t('customization.logo.form.title')"
                :placeholder="$t('customization.logo.form.title')"
                type="text"
                v-model="formLogo.title"
                color="secondary"
                class="pa-3"
            />
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="4" class="text-center">
            <v-btn v-on:click="pickFile" :loading="loadingLogo" outlined color="secondary" class="mt-3">
              <v-icon class="mr-2">cloud_upload</v-icon>
              {{ $t('customization.logo.form.upload') }}
            </v-btn>
            <input type="file" style="display: none" ref="img" accept="image/*" @change="onFilePicked"/>

            <v-alert class="mx-2 mt-2" :value="!!errorMessageLogo" color="error" dense text>
              {{ errorMessageLogo }}
            </v-alert>

          </v-col>


        </v-row>

      </v-form>
    </v-card-text>



    <v-card-text class="pt-0 ">
      <v-row justify="center" align-content="center">
        <v-col cols="12" md="4" lg="4">
          <v-card>
            <v-card-title>
              <div v-t="'customization.preview'"></div>
            </v-card-title>

            <logo-preview :mode="formLogo.mode" :src="formLogo.url" :title="formLogo.title"/>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>



    <v-divider></v-divider>

    <v-card-actions>
      <v-btn :loading="loading" @click="saveLogo" text color="blue darken-4" v-t="'customization.applyButton'"></v-btn>
    </v-card-actions>

  </v-card>
</template>
<script>
import LogoPreview from "../../../../components/LogoPreview/LogoPreview"
import {mapMutations, mapState} from 'vuex'
import {
  LOGO_MODE_ONLYTITLE,
  LOGO_MODE_RECTANGLE,
  LOGO_MODE_ROUND,
  LOGO_MODE_SQUARE
} from "../../../../constants";
import CustomizationProvider from "../../../../providers/CustomizationProvider";
import {ClientError} from "../../../../errors/ClientError";

export default {
  name: 'customization-logo',
  components: {LogoPreview},
  props: {
    formLogo: {type: Object},
  },
  data() {
    return {
      errorMessage: null,
      errorMessageLogo: null,
      loading: false,
      loadingLogo: false,
      img: null,
      rules: {
        required: value => !!value || 'Requerido'
      },
    }
  },
  mounted(){
    this.formLogo.url = this.urlValue;
    this.formLogo.mode = this.modeValue;
    this.formLogo.title = this.titleValue;
  },
  computed: {
    ...mapState({
      urlValue: state => state.customization.logo.url,
      modeValue: (state) => state.customization.logo.mode,
      titleValue: (state) => state.customization.logo.title
    }),
    modes() {
      return [
        {id: LOGO_MODE_ROUND, name: this.$t('customization.logo.options.round')},
        {id: LOGO_MODE_SQUARE, name: this.$t('customization.logo.options.square')},
        {id: LOGO_MODE_RECTANGLE, name: this.$t('customization.logo.options.rectangle')},
        {id: LOGO_MODE_ONLYTITLE, name: this.$t('customization.logo.options.onlytitle')}
      ]
    },
  },
  methods: {
    ...mapMutations(['setLogo']),
    saveLogo() {
      this.loading = true
      this.errorMessage = null
      CustomizationProvider.updateLogo(this.formLogo).then(r => {
        let logo = r.data.logoUpdate
        //STORAGE
        this.setLogo(logo)
      }).catch(error => {
        let clientError = new ClientError(error)
        this.inputErrors = clientError.inputErrors
        this.errorMessage = clientError.showMessage
      }).finally(() => this.loading = false)
    },
    pickFile() {
      this.$refs.img.click()
    },
    onFilePicked: function (e) {
      let img = e.target.files[0]
      this.errorMessageLogo = null
      if (this.$refs.logoForm.validate() && img) {
        this.loadingLogo = true
        CustomizationProvider.logoUpload(img).then(r => {
          this.formLogo.url = r.data.logoUpload.url
        }).catch(err => {
          this.errorMessageLogo = this.$t('error.' + err.message.replace('GraphQL error:', '').trim())
        }).finally(() => this.loadingLogo = false)
      }
    },
  }
}
</script>

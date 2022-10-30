<template>
  <v-row v-if="!loading">

    <v-col cols="12" md="3">
      <customization-menu v-model="selected"/>
    </v-col>

    <v-col cols="12" md="9">
      <customization-lang v-if="selected === 0"
                          :form-lang="formLang"
                          :langs="langs"
      />

      <customization-colors v-if="selected === 1"
                            :form-colors="formColors"
      />

      <customization-logo v-if="selected === 2"
                          :form-logo="formLogo"
      />

    </v-col>

  </v-row>
</template>

<script>
import CustomizationProvider from "../../../providers/CustomizationProvider";
import {LOGO_MODE_ONLYTITLE} from '../../../constants'
import CustomizationMenu from "./CustomizationMenu";
import CustomizationColors from "./CustomizationColors";
import CustomizationLogo from "./CustomizationLogo";
import CustomizationLang from "./CustomizationLang";

export default {
  name: "CustomizationManagement",
  components: {CustomizationLang, CustomizationLogo, CustomizationColors, CustomizationMenu},
  created() {
    this.loading = true
    CustomizationProvider.customization().then(r => {
      this.formColors.lightTheme = r.data.customization.lightTheme
      delete this.formColors.lightTheme.__typename
      this.formColors.darkTheme = r.data.customization.darkTheme
      delete this.formColors.darkTheme.__typename

      this.formLogo.mode = r.data.customization.logo.mode
      this.formLogo.title = r.data.customization.logo.title
      this.formLogo.url = r.data.customization.logo.url

      this.formLang.language = r.data.customization.language

    }).finally(() => this.loading = false)
  },
  data() {
    return {
      modal: false,
      selected: 0,
      title: "Creando Customization",
      errorMessage: '',
      inputErrors: {},
      loading: false,
      menu: {
        primary: false,
        onPrimary: false,
        secondary: false,
        onSecondary: false,
      },
      langs: [{value: 'es', text: 'Español'}, {value: 'en', text: 'English'}, {value: 'pt', text: 'Português'}],

      formLang: {
        language: null,
      },

      formLogo: {
        mode: LOGO_MODE_ONLYTITLE,
        title: 'APP',
        url: null
      },
      formColors: {
        lightTheme: {
          primary: null,
          onPrimary: null,
          secondary: null,
          onSecondary: null,
          background: null,
          appBar: null,
        },
        darkTheme: {
          primary: null,
          onPrimary: null,
          secondary: null,
          onSecondary: null,
          background: null,
          appBar: null,
        }

      },
      rules: {
        required: value => !!value || 'Requerido'
      },

    }
  },

}
</script>

<style scoped>
.colorBox {
  border: 1px solid grey;
  font-weight: bold;
  padding: 5px;
}
</style>

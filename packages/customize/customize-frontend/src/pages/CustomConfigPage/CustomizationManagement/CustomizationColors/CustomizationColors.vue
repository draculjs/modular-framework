<template>
  <v-container fluid>
    <v-card v-if="formColors.lightTheme" outlined>
      <v-card-title>
        <div v-t="'customization.colors.lightTitle'"></div>
        <br>
      </v-card-title>
      <v-card-subtitle v-t="'customization.colors.lightSubtitle'">
      </v-card-subtitle>
      <v-card-text class="pb-0 ">
        <v-form ref="colorsForm" autocomplete="off" @submit.prevent="$emit('save')">

          <v-row>
            <v-col cols="12" sm="4" md="2" class="pb-0">
              <color-input v-model="formColors.lightTheme.background"
                           :label="$t('customization.colors.background')"
                           color="secondary"
                           :rules="[rules.required]"
              />
            </v-col>

            <v-col cols="12" sm="4" md="2" class="pb-0">
              <color-input v-model="formColors.lightTheme.primary"
                           :label="$t('customization.colors.primary')"
                           color="secondary"
                           :rules="[rules.required]"
              />
            </v-col>

            <v-col cols="12" sm="4" md="2">
              <color-input v-model="formColors.lightTheme.onPrimary"
                           :label="$t('customization.colors.onPrimary')"
                           color="secondary"
                           :rules="[rules.required]"
              />
            </v-col>

            <v-col cols="12" sm="4" md="2">
              <color-input v-model="formColors.lightTheme.secondary"
                           :label="$t('customization.colors.secondary')"
                           color="secondary"
                           :rules="[rules.required]"
              />
            </v-col>

            <v-col cols="12" sm="4" md="2">
              <color-input v-model="formColors.lightTheme.onSecondary"
                           :label="$t('customization.colors.onSecondary')"
                           color="secondary"
                           :rules="[rules.required]"
              />
            </v-col>

          </v-row>
        </v-form>

      </v-card-text>

      <v-card-text class="pt-0 ">

        <colors-preview
            :background="formColors.lightTheme.background"
            :primary="formColors.lightTheme.primary"
            :on-primary="formColors.lightTheme.onPrimary"
            :secondary="formColors.lightTheme.secondary"
            :on-secondary="formColors.lightTheme.onSecondary"

        />
      </v-card-text>

    </v-card>


    <v-card v-if="formColors.darkTheme" outlined class="mt-3">
      <v-card-title>
        <div v-t="'customization.colors.darkTitle'"></div>
        <br>
      </v-card-title>
      <v-card-subtitle v-t="'customization.colors.darkSubtitle'">
      </v-card-subtitle>
      <v-card-text class="pb-0 ">
        <v-form ref="colorsForm" autocomplete="off" @submit.prevent="$emit('save')">

          <v-row>
            <v-col cols="12" sm="4" md="2" class="pb-0">
              <color-input v-model="formColors.darkTheme.background"
                           :label="$t('customization.colors.background')"
                           color="secondary"
                           :rules="[rules.required]"
              />
            </v-col>

            <v-col cols="12" sm="4" md="2" class="pb-0">
              <color-input v-model="formColors.darkTheme.primary"
                           :label="$t('customization.colors.primary')"
                           color="secondary"
                           :rules="[rules.required]"
              />
            </v-col>

            <v-col cols="12" sm="4" md="2">
              <color-input v-model="formColors.darkTheme.onPrimary"
                           :label="$t('customization.colors.onPrimary')"
                           color="secondary"
                           :rules="[rules.required]"
              />
            </v-col>

            <v-col cols="12" sm="4" md="2">
              <color-input v-model="formColors.darkTheme.secondary"
                           :label="$t('customization.colors.secondary')"
                           color="secondary"
                           :rules="[rules.required]"
              />
            </v-col>

            <v-col cols="12" sm="4" md="2">
              <color-input v-model="formColors.darkTheme.onSecondary"
                           :label="$t('customization.colors.onSecondary')"
                           color="secondary"
                           :rules="[rules.required]"
              />
            </v-col>

          </v-row>
        </v-form>

      </v-card-text>

      <v-card-text class="pt-0 ">
        <colors-preview
            :background="formColors.darkTheme.background"
            :primary="formColors.darkTheme.primary"
            :on-primary="formColors.darkTheme.onPrimary"
            :secondary="formColors.darkTheme.secondary"
            :on-secondary="formColors.darkTheme.onSecondary"

        />
      </v-card-text>

    </v-card>

    <v-card>
      <v-card-actions>
        <v-btn @click="saveColors" text color="blue darken-4" v-t="'customization.applyButton'"></v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import ColorInput from "./ColorInput"
import CustomizationProvider from "../../../../providers/CustomizationProvider";
import {ClientError} from "@dracul/user-frontend";
import {mapMutations} from "vuex";
import ColorsPreview from "./ColorsPreview";

export default {
  name: 'customization-colors',
  components: {ColorsPreview, ColorInput},
  props: {
    formColors: {},
  },
  methods: {
    ...mapMutations([
      'setColors'
    ]),
    saveColors() {
      if (this.$refs.colorsForm.validate()) {
        CustomizationProvider.updateColors(this.formColors).then(r => {
              this.setColors(r.data.colorsUpdate)
            }
        ).catch(error => {
          let clientError = new ClientError(error)
          this.inputErrors = clientError.inputErrors
          this.errorMessage = clientError.showMessage
        })
      }
    },
  },
  computed: {
    getStyleColor() {
      return (theme, color, onColor) => "background-color: " + this.formColors[theme][color] + "; color: " + this.formColors[theme][onColor]
    },
  },
  data() {
    return {
      inputErrors: [],
      rules: {
        required: value => !!value || 'Requerido'
      },
    }
  }
}
</script>

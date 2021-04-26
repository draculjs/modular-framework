<template>

  <v-card class="elevation-12 ">

    <v-card-text class="pt-4 px-8 my-0 pb-0 text-center">
      <v-btn fab class="onPrimary--text" color="primary">
        <v-icon>lock</v-icon>
      </v-btn>
      <h2 class="mt-3" v-t="'auth.passwordRecovery'"></h2>
    </v-card-text>

    <v-card-text v-if="success">
      <recovery-password-form-success></recovery-password-form-success>
    </v-card-text>

    <v-card-text v-else class="pt-3">

      <v-alert v-if="errorMessage" type="error" dense text>{{ $t(errorMessage) }}</v-alert>

      <v-form
          ref="form"
          v-model="valid"
          lazy-validation
      >
        <v-row>
          <v-col cols="12">

            <v-text-field
                v-model="form.newPassword"
                autocomplete="new-password"
                :label="$t('user.label.newPassword')"
                :placeholder="$t('user.label.newPassword')"
                :append-icon="showNewPassword ? 'visibility' : 'visibility_off'"
                :type="showNewPassword ? 'text' : 'password'"
                @click:append="showNewPassword = !showNewPassword"
                :rules="requiredRule"
                :error="hasInputErrors('newPassword')"
                :error-messages="getInputErrors('newPassword')"
            ></v-text-field>

            <v-text-field
                v-model="form.passwordVerify"
                autocomplete="new-password"
                :label="$t('user.label.repeatPassword')"
                :placeholder="$t('user.label.repeatPassword')"
                :append-icon="showRepeatPassword ? 'visibility' : 'visibility_off'"
                :type="showRepeatPassword ? 'text' : 'password'"
                @click:append="showRepeatPassword = !showRepeatPassword"
                :rules="requiredRule"
                :error="!!passwordMatchError"
                :error-messages="passwordMatchError"
            ></v-text-field>

          </v-col>

          <v-col>
            <v-row justify="center">
              <submit-button @click="submit"
                             text="common.confirm"
                             :loading="loading"
                             :disabled="!valid"
              />
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>

import InputErrors from "../../../../mixins/InputErrors";
import UserValidations from "../../../../mixins/UserValidations";
import recoveryProvider from "../../../../providers/RecoveryProvider";
import ClientError from "../../../../errors/ClientError";
import {SubmitButton} from '@dracul/common-frontend'
import {mapActions} from "vuex";
import RecoveryPasswordFormSuccess from "./RecoveryPasswordFormSuccess";

export default {
  name: "RecoveryPasswordForm",
  components: {RecoveryPasswordFormSuccess, SubmitButton},
  mixins: [InputErrors, UserValidations],
  props: {
    token: String
  },
  data() {
    return {
      valid: true,
      showNewPassword: false,
      showRepeatPassword: false,
      loading: false,
      success: null,
      form: {
        newPassword: null,
        passwordVerify: null,
      },
      errorMessage: null
    }
  },
  methods: {
    ...mapActions(['verifyToken']),
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        recoveryProvider.recoveryChangePassword(this.token, this.form.newPassword).then((response) => {
          this.success = response.data.recoveryChangePassword.status
          if (this.success) {
            this.verifyToken(response.data.recoveryChangePassword.token)
          } else {
            this.errorMessage = response.data.recoveryChangePassword.message
          }

        }).catch((err) => {
          let clientError = new ClientError(err)
          this.inputErrors = clientError.inputErrors
        }).finally(() => this.loading = false)
      }
    }
  },
  computed: {
    passwordMatchError() {
      return (this.form.newPassword === this.form.passwordVerify) ? null : this.$t('user.validation.passwordVerify')
    }
  },
}
</script>

<style scoped>

</style>

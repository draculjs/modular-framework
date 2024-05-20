<template>

  <crud-update :open="open"
               :loading="loading"
               title="user.changePasswordTitle"
               :errorMessage="errorMessage"
               @update="submit"
               @close="$emit('close')"
  >

    <v-form ref="form" autocomplete="off" v-model="valid" @submit.prevent="submit">
      <v-row row wrap>

        <v-col cols="12">
          <v-text-field readonly disabled
                        prepend-icon="person"
                        :value="user.username"
                        :label="$t('user.label.username')"
                        :placeholder="$t('user.label.username')"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field id="password"
                        prepend-icon="lock"
                        name="password"
                        :append-icon="showNewPassword ? 'visibility' : 'visibility_off'"
                        :type="showNewPassword ? 'text' : 'password'"
                        @click:append="showNewPassword = !showNewPassword"
                        v-model="form.password"
                        :label="$t('user.label.newPassword')"
                        :placeholder="$t('user.label.newPassword')"
                        autocomplete="new-password"
                        :rules="newPasswordRules"
                        :error="hasInputErrors('password')"
                        :error-messages="getInputErrors('password')"
                        required
          />
        </v-col>
        <v-col cols="12">
          <v-text-field id="password_verify"
                        prepend-icon="lock"
                        name="password_verify"
                        :append-icon="showRepeatPassword ? 'visibility' : 'visibility_off'"
                        :type="showRepeatPassword ? 'text' : 'password'"
                        @click:append="showRepeatPassword = !showRepeatPassword"
                        v-model="form.passwordVerify"
                        :rules="passwordMatchRules"
                        :label="$t('user.label.repeatPassword')"
                        :placeholder="$t('user.label.repeatPassword')"
                        autocomplete="new-password"
                        :error="!!passwordMatchError"
                        :error-messages="passwordMatchError"
                        required
          />
        </v-col>
      </v-row>
    </v-form>

  </crud-update>

</template>

<script>

import UserProvider from "../../../providers/UserProvider";
import {CrudUpdate, ClientError, InputErrors, RequiredRule} from '@dracul/common-frontend'

export default {
  name: "AdminChangePassword",
  components: {CrudUpdate},
  props: {
    user: Object,
    open: Boolean
  },
  mixins: [InputErrors, RequiredRule],
  data() {
    return {
      valid: true,
      showNewPassword: false,
      showRepeatPassword: false,
      loading: false,
      status: null,
      errorMessage: null,
      form: {
        password: null,
        passwordVerify: null,
      },
      errors: {},
      passwordRules: {
        regex: '/.*/',
        requirements: ''
      }
    }
  },
  computed: {
    passwordMatchError() {
      return (this.form.password === this.form.passwordVerify) ? null : this.$t('user.validation.passwordVerify')
    },
    passwordRegex(){
      let r = new RegExp(this.passwordRules.regex)
      return r
    },
    newPasswordRules(){
      return [
        v => !!v || this.$t('user.validation.required'),
        v => this.passwordRegex.test(this.form.password) || this.passwordRules.requirements,
      ]
    },
    passwordMatchRules() {
      return [
        v => !!v || this.$t('user.validation.required'),
        //v => this.passwordRegex.test(this.form.password) || this.passwordRules.requirements,
        () => (this.form.password === this.form.passwordVerify) || this.$t('user.validation.passwordVerify')
      ]
    },
  },
  created() {
    this.fetchPasswordRules()
  },
  methods: {
    fetchPasswordRules() {
      UserProvider.fetchPasswordRules()
          .then(r => {
            this.passwordRules = r.data.fetchPasswordRules
          })
    },
    resetValidation: function () {
      this.errors = {}
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.resetValidation()
        let userId = this.user ? this.user.id : null
        UserProvider.adminChangePassword(userId, this.form.password, this.form.passwordVerify)
            .then(() => {
              this.$emit('changePasswordConfirmed', this.user)
              this.$emit('close')
              this.status = true
            }).catch(error => {
          let clientError = new ClientError(error)
          this.inputErrors = clientError.inputErrors
          this.errorMessage = clientError.i18nMessage
        }).finally(() => this.loading = false)
      }
    },
  }
}
</script>

<style scoped>

</style>

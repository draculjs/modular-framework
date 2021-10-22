<template>
    <v-card>
        <toolbar-dialog title="user.changeYourPassword"
                        @close="cancel"/>
        <v-card-text>
            <v-alert v-if="errorMessage" type="error" dense text v-t="errorMessage"></v-alert>
        </v-card-text>
        <v-card-text>
            <v-form ref="form" autocomplete="off" v-model="valid" @submit.prevent="submit">
                <v-col cols="12">

                    <v-text-field
                            id="current-password"
                            prepend-icon="lock"
                            :append-icon="showCurrentPassword ? 'visibility' : 'visibility_off'"
                            :type="showCurrentPassword ? 'text' : 'password'"
                            @click:append="showCurrentPassword = !showCurrentPassword"
                            v-model="form.currentPassword"
                            :rules="requiredRule"
                            :label="$t('user.label.currentPassword')"
                            :placeholder="$t('user.label.currentPassword')"
                            autocomplete="new-password"
                            :error="hasInputErrors('currentPassword')"
                            :error-messages="getInputErrors('currentPassword')"
                            required
                            color="secondary"
                            @change="clearCurrentPasswordInputError"
                    />
                </v-col>
                <v-col cols="12">
                    <v-text-field
                            id="new-password"
                            prepend-icon="lock"
                            :append-icon="showNewPassword ? 'visibility' : 'visibility_off'"
                            :type="showNewPassword ? 'text' : 'password'"
                            @click:append="showNewPassword = !showNewPassword"
                            v-model="form.newPassword"
                            :rules="requiredRule"
                            :label="$t('user.label.newPassword')"
                            :placeholder="$t('user.label.newPassword')"
                            autocomplete="new-password"
                            :error="hasInputErrors('newPassword')"
                            :error-messages="getInputErrors('newPassword')"
                            required
                            color="secondary"
                            @change="clearNewPasswordInputError"
                    />
                </v-col>

                <v-col cols="12">
                    <v-text-field id="password_verify"
                                  prepend-icon="lock"
                                  :append-icon="showRepeatPassword ? 'visibility' : 'visibility_off'"
                                  :type="showRepeatPassword ? 'text' : 'password'"
                                  @click:append="showRepeatPassword = !showRepeatPassword"
                                  v-model="form.passwordVerify"
                                  :rules="passwordMatchRules"
                                  :label="$t('user.label.repeatPassword')"
                                  :placeholder="$t('user.label.repeatPassword')"
                                  autocomplete="new-password"
                                  ref="passwordVerify"
                    />
                </v-col>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <close-button text="common.cancel" @click="cancel"></close-button>
            <submit-button @click="submit" :loading="loading" :disabled="!valid"></submit-button>
        </v-card-actions>
    </v-card>
</template>

<script>
    import ProfileProvider from "../../../providers/ProfileProvider";
    import ClientError from "../../../errors/ClientError";
    import UserValidations from "../../../mixins/UserValidations";
    import InputErrors from "../../../mixins/InputErrors";
    import {SubmitButton, CloseButton, ToolbarDialog} from '@dracul/common-frontend'

    export default {
        name: "ProfilePasswordForm",
        components: {ToolbarDialog, SubmitButton, CloseButton},
        mixins: [InputErrors, UserValidations],
        data() {
            return {
                loading: false,
                valid: true,
                status: false,
                errorMessage: null,
                showCurrentPassword: false,
                showNewPassword: false,
                showRepeatPassword: false,
                form: {
                    currentPassword: null,
                    newPassword: null,
                    passwordVerify: null
                },
                errors: {}
            }
        },
        computed: {
            passwordMatchError() {
                return (this.form.newPassword === this.form.passwordVerify) ? null : this.$t('user.validation.passwordVerify')
            },
            passwordMatchRules() {
                return [
                    v => !!v || this.$t('user.validation.required'),
                    () => (this.form.newPassword === this.form.passwordVerify) || this.$t('user.validation.passwordVerify')
                ]
            }
        },
        methods: {
            clearCurrentPasswordInputError() {
                if(this.inputErrors['currentPassword']){
                    this.inputErrors['currentPassword'] = null
                }
            },
            clearNewPasswordInputError() {
              this.$refs.passwordVerify.validate()
                if(this.inputErrors['newPassword']){
                    this.inputErrors['newPassword'] = null
                }
            },
            resetValidation: function () {
                this.errors = {};
            },
            submit() {
                if (this.$refs.form.validate()) {
                    this.resetValidation()
                    this.loading = true
                    ProfileProvider.changePassword(this.form.currentPassword, this.form.newPassword).then((response) => {
                        this.status = response.data.changePassword.status
                        if (this.status) {
                            this.$emit('success')
                        }
                    }).catch((err) => {
                        let clientError = new ClientError(err)
                        this.inputErrors = clientError.inputErrors
                        this.errorMessage = clientError.i18nMessage
                    }).finally(() => this.loading = false)
                }
            },
            cancel() {
                this.$emit("close");
                this.$refs.form.reset();
                this.form.currentPassword = null;
                this.form.newPassword = null;
                this.form.passwordVerify = null;
            }
        }
    };
</script>

<style scoped>
</style>

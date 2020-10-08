<template>

    <v-form ref="form" autocomplete="off">
        <v-row>
            <v-col cols="12" sm="6">
                <v-text-field

                        prepend-icon="account_box"
                        name="name"
                        type="text"
                        v-model="form.name"
                        :label="$t('user.label.fullname')"
                        :placeholder="$t('user.label.fullname')"
                        :rules="requiredRule"
                        :error="hasInputErrors('name')"
                        :error-messages="getInputErrors('name')"
                        required
                />
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field
                        xs6
                        prepend-icon="person"
                        name="username"
                        type="text"
                        v-model="form.username"
                        :label="$t('user.label.username')"
                        :placeholder="$t('user.label.username')"
                        autocomplete="new-password"
                        :rules="requiredRule"
                        :error="hasInputErrors('username')"
                        :error-messages="getInputErrors('username')"
                        required
                />
            </v-col>

            <v-col cols="12" sm="6">
                <v-text-field prepend-icon="email"
                              name="email"
                              type="text"
                              v-model="form.email"
                              :label="$t('user.label.email')"
                              :placeholder="$t('user.label.email')"
                              :rules="emailRules"
                              :error="hasInputErrors('email')"
                              :error-messages="getInputErrors('email')"
                              required
                />
            </v-col>

            <v-col cols="12" sm="6">
                <v-text-field prepend-icon="email"
                              name="email_verify"
                              type="text"
                              v-model="form.email_verify"
                              :label="$t('user.label.repeatEmail')"
                              :placeholder="$t('user.label.repeatEmail')"
                              onPaste="return false"
                              :rules="requiredRule"
                              :error="emailMatchError == '' ? false : true"
                              :error-messages="emailMatchError"
                              required
                />
            </v-col>


            <v-col cols="12" sm="6">
                <v-text-field id="password"
                              prepend-icon="lock"
                              name="password"
                              type="password"
                              v-model="form.password"
                              :label="$t('user.label.password')"
                              :placeholder="$t('user.label.password')"
                              autocomplete="new-password"
                              ref="password"
                              :rules="requiredRule"
                              :error="hasInputErrors('password')"
                              :error-messages="getInputErrors('password')"
                              required
                />
            </v-col>

            <v-col cols="12" sm="6">
                <v-text-field id="password_verify"
                              prepend-icon="lock"
                              name="password_verify"
                              type="password"
                              v-model="form.password_verify"
                              :label="$t('user.label.repeatPassword')"
                              :placeholder="$t('user.label.repeatPassword')"
                              autocomplete="new-password"
                              :rules="requiredRule"
                              :error="passwordMatchError == '' ? false : true"
                              :error-messages="passwordMatchError"
                />
            </v-col>

            <v-col cols="12" sm="6">
                <v-text-field prepend-icon="phone"
                              name="phone"
                              type="text"
                              v-model="form.phone"
                              :label="$t('user.label.phone')"
                              :placeholder="$t('user.label.phone')"
                              :error="hasInputErrors('phone')"
                              :error-messages="getInputErrors('phone')"
                />
            </v-col>

            <v-col cols="12">
                <submit-button :loading="loading" @click="register" v-t="'auth.signUp'"></submit-button>
            </v-col>
        </v-row>
    </v-form>

</template>

<script>
    import AuthProvider from '../../../providers/AuthProvider';
    import ClientError from '../../../errors/ClientError'
    import InputErrors from "../../../mixins/InputErrors";
    import {SubmitButton} from '@dracul/common-frontend'

    export default {
        name: "RegisterForm",
        components: {SubmitButton},
        mixins: [InputErrors],
        data: () => ({
                loading: false,
                error: null,
                form: {
                    name: null,
                    username: null,
                    password: null,
                    password_verify: null,
                    email: null,
                    email_verify: null,
                    phone: null,
                },
                errors: {
                    name: [],
                    username: [],
                    password: [],
                    password_verify: [],
                    email: [],
                    phone: [],
                },

            }
        ),
        computed: {
            requiredRule() {
                return [v => !!v || this.$t('user.validation.required')];
            },
            emailRules(){
                return [
                    v => !!v || this.$t('user.validation.required'),
                    v => /.+@.+/.test(v) || this.$t('user.validation.emailFormat')
                ]
            },
            passwordMatchError() {
                return (this.form.password === this.form.password_verify) ? '' : this.$t('user.validation.passwordVerify')
            },
            emailMatchError() {
                return (this.form.email === this.form.email_verify) ? '' : this.$t('user.validation.emailVerify')
            }
        },
        methods: {
            register() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    AuthProvider.register(this.form).then(res => {
                       if (res.data.register.status) {
                            this.$emit("userRegistered", res.data.register.email)
                        }
                    }).catch(err => {
                        let clientError = new ClientError(err)
                        this.error = clientError.i18nMessage
                        this.inputErrors = clientError.inputErrors
                    }).finally(() => this.loading = false)
                }
            },
        }
    }
</script>

<style scoped>
    a {
        text-decoration: none;
    }
</style>

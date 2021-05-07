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
                        class="pa-3"
                        :rules="required"
                        :error="hasInputErrors('name')"
                        :error-messages="getInputErrors('name')"
                        required
                        color="secondary"
                >
                    <template v-slot:append>
                        <v-tooltip
                        bottom
                        >
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on">
                            mdi-exclamation-thick
                            </v-icon>
                        </template>
                        {{$t('user.mandatoryText')}}
                        </v-tooltip>
                    </template>
                </v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
                <v-text-field prepend-icon="person"
                              name="username"
                              type="text"
                              v-model="form.username"
                              :label="$t('user.label.username')"
                              :placeholder="$t('user.label.username')"
                              class="pa-3"
                              autocomplete="new-password"
                              :rules="required"
                              :error="hasInputErrors('username')"
                              :error-messages="getInputErrors('username')"
                              required
                              color="secondary"
                >
                    <template v-slot:append>
                        <v-tooltip
                        bottom
                        >
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on">
                            mdi-exclamation-thick
                            </v-icon>
                        </template>
                        {{$t('user.mandatoryText')}}
                        </v-tooltip>
                    </template>
                </v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
                <v-text-field prepend-icon="email"
                              name="email"
                              type="text"
                              class="pa-3"
                              v-model="form.email"
                              :label="$t('user.label.email')"
                              :placeholder="$t('user.label.email')"
                              :rules="emailRules"
                              :error="hasInputErrors('email')"
                              :error-messages="getInputErrors('email')"
                              required
                              color="secondary"
                >
                    <template v-slot:append>
                        <v-tooltip
                        bottom
                        >
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on">
                            mdi-exclamation-thick
                            </v-icon>
                        </template>
                        {{$t('user.mandatoryText')}}
                        </v-tooltip>
                    </template>
                </v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
                <v-text-field prepend-icon="phone"
                              name="phone"
                              type="text"
                              class="pa-3"
                              v-model="form.phone"
                              :label="$t('user.label.phone')"
                              :placeholder="$t('user.label.phone')"
                              :error="hasInputErrors('phone')"
                              :error-messages="getInputErrors('phone')"
                              :rules="validateNumericRule"
                              required
                              color="secondary"
                ></v-text-field>
            </v-col>


            <v-col v-if="enablePassword" cols="12" sm="6">
                <v-text-field id="password"
                              prepend-icon="lock"
                              name="password"
                              type="password"
                              v-model="form.password"
                              class="pa-3"
                              :label="$t('user.label.password')"
                              :placeholder="$t('user.label.password')"
                              autocomplete="new-password"
                              ref="password"
                              :rules="required"
                              :error="hasInputErrors('password')"
                              :error-messages="getInputErrors('password')"
                              required
                              color="secondary"
                >
                    <template v-slot:append>
                        <v-tooltip
                        bottom
                        >
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on">
                            mdi-exclamation-thick
                            </v-icon>
                        </template>
                        {{$t('user.mandatoryText')}}
                        </v-tooltip>
                    </template>
                </v-text-field>
            </v-col>

            <v-col v-if="enablePassword" cols="12" sm="6">
                <v-text-field
                        id="password_verify"
                        prepend-icon="lock"
                        name="password_verify"
                        type="password"
                        v-model="form.password_verify"
                        :label="$t('user.label.repeatPassword')"
                        :placeholder="$t('user.label.repeatPassword')"
                        autocomplete="new-password"
                        class="pa-3"
                        :rules="passwordMatchRules"
                        :error="passwordMatchError == '' ? false : true"
                        :error-messages="passwordMatchError"
                        required
                        color="secondary"
                >
                    <template v-slot:append>
                        <v-tooltip
                        bottom
                        >
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on">
                            mdi-exclamation-thick
                            </v-icon>
                        </template>
                        {{$t('user.mandatoryText')}}
                        </v-tooltip>
                    </template>
                </v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
                <v-select
                        prepend-icon="account_box"
                        class="pa-3"
                        :items="roles"
                        :item-text="'name'"
                        :item-value="'id'"
                        v-model="form.role"
                        :label="$t('user.label.role')"
                        :loading="loadingRoles"
                        :rules="required"
                        :error="hasInputErrors('role')"
                        :error-messages="getInputErrors('role')"
                        required
                        color="secondary"
                        item-color="secondary"
                >
                    <template v-slot:append>
                        <v-tooltip
                        bottom
                        >
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on">
                            mdi-exclamation-thick
                            </v-icon>
                        </template>
                        {{$t('user.mandatoryText')}}
                        </v-tooltip>
                    </template>
                </v-select>
            </v-col>

            <v-col cols="12" sm="6">
                <v-select
                        v-model="form.groups"
                        :loading="loadingGroups"
                        :items="groups"
                        :item-text="'name'"
                        :item-value="'id'"
                        attach
                        chips
                        :label="$t('user.label.groups')"
                        :placeholder="$t('user.label.groups')"
                        multiple
                ></v-select>
            </v-col>
            <v-col cols="12" sm="6" class="pl-8">
                <v-switch color="success" :label="form.active?'Activo':'Inactivo'" input-value="0"
                          v-model="form.active"></v-switch>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
    import RoleProvider from "../../../providers/RoleProvider";
    import GroupProvider from "../../../providers/GroupProvider";
    import {InputErrorsByProps, RequiredRule} from "@dracul/common-frontend";

    export default {
        name: "UserForm",
        mixins: [InputErrorsByProps, RequiredRule],
        props:{
            value: {
                type: Object,
                required: true
            },
            enablePassword: {
                type: Boolean,
                required: false
            },
        },
        data(){
            return {
                roles: [],
                groups: [],
                loadingRoles: false,
                loadingGroups: false,
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
        mounted() {
            this.loadRoles()
            this.loadGroups()
        },
        computed: {
            form: {
                get() { return this.value },
                set(val) {this.$emit('input', val)}
            },
            passwordMatchError() {
                return (this.form.password === this.form.password_verify) ? '' : this.$t('user.validation.passwordVerify')
            },
            emailRules() {
                return [
                    v => !!v || this.$t('user.validation.required'),
                    v => /.+@.+/.test(v) || this.$t('user.validation.emailFormat')
                ]
            },
            validateNumericRule() {
                return [
                    v => /^[0-9]+$/i.test(v)|| !v || this.$t('user.validation.number')
                ]
            },
            passwordMatchRules() {
                return [
                    v => !!v || this.$t('user.validation.required'),
                    () => (this.form.password === this.form.password_verify) || this.$t('user.validation.passwordVerify')
                ]
            },
        },
        methods:{
            validate(){
                return this.$refs.form.validate()
            },
            loadRoles(){
                this.loadingRoles = true
                RoleProvider.roles().then(r => {
                        this.roles = r.data.roles
                    }
                ).catch(err => {
                    console.error(err)
                }).finally(() => this.loadingRoles = false)
            },
            loadGroups(){
                this.loadingGroups = true
                GroupProvider.groups().then(r => {
                        this.groups = r.data.groups
                    }
                ).catch(err => {
                    console.error(err)
                }).finally(() => this.loadingGroups = false)
            },
        }
    }
</script>

<style scoped>

</style>
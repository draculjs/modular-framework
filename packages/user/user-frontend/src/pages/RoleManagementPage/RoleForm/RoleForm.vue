<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="$emit('save')">
        <v-col cols="12" sm="6">
            <v-text-field
                    prepend-icon="account_box"
                    name="name"
                    type="text"
                    v-model="form.name"
                    :label="$t('role.label.name')"
                    :placeholder="$t('role.label.name')"
                    class="pa-3"
                    :rules="required"
                    :error="hasInputErrors('name')"
                    :error-messages="getInputErrors('name')"
                    required
            ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
            <v-select
                    v-model="form.childRoles"
                    :loading="loadingRoles"
                    :items="roles"
                    :item-text="'name'"
                    :item-value="'id'"
                    attach
                    chips
                    :label="$t('role.label.childRoles')"
                    :placeholder="$t('role.label.childRoles')"
                    multiple
            ></v-select>
        </v-col>

        <v-col cols="12">
            <v-row>
                <v-col cols="12" class="py-0" v-for="(permission,index) in permissions" :key="index">

                    <v-checkbox v-model="form.permissions"
                                :label="getPermissionsTranslation(permission)"
                                :value="permission"
                                @input="inputPermission(permission)"
                                dense hide-details
                    ></v-checkbox>
                </v-col>
            </v-row>
        </v-col>
    </v-form>
</template>

<script>
    import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'
    import RoleProvider from "../../../providers/RoleProvider";
    import {RoleMixin} from "../RoleMixin";

    export default {
        name: "RoleForm",
        mixins: [RoleMixin, InputErrorsByProps, RequiredRule],
        props: {
            value: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                roles: [],
                permissions: [],
                loadingPermissions: false,
                loadingRoles: false,
            }
        },
        computed: {
            form: {
                get() {
                    return this.value
                },
                set(val) {
                    this.$emit('input', val)
                }
            },
            hasPermission() {
                return (permission) => {
                    return this.form.permissions.includes(permission)
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
        created() {
            this.loadPermissions()
            this.loadRoles()
        },
        methods: {
            validate() {
                return this.$refs.form.validate()
            },
            loadPermissions() {
                this.loadingPermissions = true
                RoleProvider.permissions().then(r => {
                    this.permissions = r.data.permissions.permissions;
                }).catch(err => {
                    console.error(err)
                }).finally(() => this.loadingPermissions = false)
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
            inputPermission(permission) {
                if (this.hasPermission(permission)) {
                    this.form.permissions = this.form.permissions.filter(p => p != permission)
                } else {
                    this.form.permissions.push(permission)
                }
            },
        }
    }
</script>

<style scoped>

</style>
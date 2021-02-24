<template>
    <crud-create :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @create="save"
                 @close="$emit('close')"
    >
        <role-form ref="form" v-model="form" :input-errors="inputErrors"></role-form>

    </crud-create>
</template>

<script>
    import RoleProvider from "../../../providers/RoleProvider";
    import {CrudCreate, ClientError} from '@dracul/common-frontend'
    import RoleForm from '../RoleForm'

    export default {
        name: "RoleCopy",
        components: {CrudCreate, RoleForm},
        props: {
            role: Object,
            open: {type: Boolean, default: true}
        },
        data() {
            return {
                title: "role.createTitle",
                errorMessage: "",
                inputErrors: {},
                loading: false,
                form: {
                    name: this.role.name + "-2",
                    childRoles: this.role.childRoles,
                    permissions: this.role.permissions
                }

            };
        },
        methods: {
            save() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    RoleProvider.roleCreate(this.form)
                        .then(r => {
                            if (r) {
                                this.$emit("roleCopied", r.data.roleCreate)
                                this.$emit("close")
                            }
                        })
                        .catch(error => {
                            let clientError = new ClientError(error);
                            this.inputErrors = clientError.inputErrors
                            this.errorMessage = clientError.i18nMessage
                        }).finally(() => this.loading = false)
                }
            },
        }
    };
</script>

<style scoped>
</style>


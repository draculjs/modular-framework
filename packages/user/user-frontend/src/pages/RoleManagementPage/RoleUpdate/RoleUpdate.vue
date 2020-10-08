<template>
    <crud-update :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @update="save"
                 @close="$emit('close')"
    >
        <role-form ref="form" v-model="form" :input-errors="inputErrors"></role-form>

    </crud-update>
</template>

<script>
    import RoleProvider from "../../../providers/RoleProvider";
    import {CrudUpdate, ClientError} from '@dracul/common-frontend'
    import RoleForm from '../RoleForm'

    export default {
        name: "RoleUpdate",
        components: {CrudUpdate, RoleForm},
        props: {
            role: Object,
            open: {type: Boolean, default: true}
        },
        data() {
            return {
                title: "role.updateTitle",
                errorMessage: "",
                inputErrors: {},
                loading: false,
                form: {
                    id: this.role.id,
                    name: this.role.name,
                    childRoles: this.role.childRoles,
                    permissions: this.role.permissions
                }

            };
        },
        methods: {
            save() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    RoleProvider.roleUpdate(this.form)
                        .then(r => {
                            if (r) {
                                this.$emit("roleUpdated", r.data.roleUpdate)
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


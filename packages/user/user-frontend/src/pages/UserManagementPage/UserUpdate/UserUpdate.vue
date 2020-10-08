<template>
    <crud-update :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @update="update"
                 @close="$emit('close')"
    >
        <user-form ref="form" v-model="form"
                   :input-errors="inputErrors"
                   :enable-password="false" />
    </crud-update>
</template>

<script>
    import UserProvider from "../../../providers/UserProvider";
    import {CrudUpdate, ClientError} from '@dracul/common-frontend'
    import UserForm from "../UserForm/UserForm";

    export default {
        name: "UserUpdate",
        props: {
            user: Object,
            open: Boolean
        },
        components: {UserForm, CrudUpdate},
        data() {
            return {
                title: this.$t('user.updateTitle'),
                errorMessage: null,
                inputErrors: {},
                loading: false,
                form: {
                    id: this.user.id,
                    username: this.user.username,
                    name: this.user.name,
                    email: this.user.email,
                    phone: this.user.phone,
                    role: this.user.role ? this.user.role.id : null,
                    groups: this.user.groups.map(group => group.id),
                    active: this.user.active
                },

            }
        },
        methods: {
            update() {
                if (this.$refs.form.validate()) {
                    this.loading=true
                    UserProvider.updateUser(this.form).then(r => {
                            if (r) {
                                this.$emit('userUpdated', r.data.updateUser)
                                this.$emit('close')
                            }
                        }
                    ).catch(error => {
                        let clientError = new ClientError(error)
                        this.inputErrors = clientError.inputErrors
                        this.errorMessage = clientError.i18nMessage
                    }).finally(()=>this.loading=false)
                }
            }
        },
    }
</script>

<style scoped>

</style>

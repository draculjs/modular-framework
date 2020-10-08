<template>
    <crud-create :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @create="create"
                 @close="$emit('close')"
    >
        <user-form ref="form" v-model="form"
                   :input-errors="inputErrors"
                   :enable-password="true" />

    </crud-create>
</template>

<script>
    import UserProvider from "../../../providers/UserProvider";
    import {CrudCreate, ClientError} from '@dracul/common-frontend'
    import UserForm from "../UserForm/UserForm";

    export default {
        name: "UserCreate",
        components: {UserForm, CrudCreate},
        props: {
            open: Boolean
        },
        data() {
            return {
                title: this.$t('user.createTitle'),
                errorMessage: null,
                inputErrors: {},
                loading: false,
                form: {
                    username: '',
                    password: '',
                    password_verify: '',
                    name: '',
                    email: '',
                    phone: '',
                    role: null,
                    groups: [],
                    active: true
                },
            }
        },
        methods: {
            create() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    UserProvider.createUser(this.form).then(r => {
                            if (r) {
                                this.$emit('userCreated', r.data.createUser)
                                this.$emit('close')
                            }
                        }
                    ).catch(error => {
                        let clientError = new ClientError(error)
                        this.inputErrors = clientError.inputErrors
                        this.errorMessage = clientError.i18nMessage
                    }).finally(() => {
                        this.loading = false
                    })
                }
            }
        },
    }
</script>

<style scoped>

</style>

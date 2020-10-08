<template>
    <crud-delete :open="open"
                 :loading="loading"
                 :errorMessage="errorMessage"
                 @delete="remove"
                 @close="$emit('close')"
    >

        <v-card-text>
            <user-show-data :item="user"/>
        </v-card-text>

        <v-card-text>
            <v-alert v-if="errorMessage" type="error" dense text>{{errorMessage}}</v-alert>
        </v-card-text>

        <v-card-text>
            <v-row justify="center">
                <span class="title">{{areYouSure}}</span>
            </v-row>
        </v-card-text>

    </crud-delete>
</template>

<script>
    import UserShowData from "../UserShow/UserShowData";
    import UserProvider from "../../../providers/UserProvider";
    import {CrudDelete, ClientError} from '@dracul/common-frontend'

    export default {
        name: "UserDelete",
        components: {CrudDelete, UserShowData},
        props: {
            user: Object,
            open: Boolean
        },
        data() {
            return {
                modal: false,
                title: this.$t('user.deleteTitle'),
                areYouSure: this.$t('user.deleteConfirm'),
                errorMessage: '',
                loading: false,
            }
        },
        methods: {
            remove() {
                this.loading = true
                UserProvider.deleteUser(this.user.id).then(() => {
                    this.$emit('userDeleted', this.user)
                    this.$emit('close')
                }).catch(error => {
                    let clientError = new ClientError(error)
                    this.inputErrors = clientError.inputErrors
                    this.errorMessage = clientError.i18nMessage
                }).finally(() => this.loading = false)
            },
        },
    }
</script>

<style scoped>

</style>


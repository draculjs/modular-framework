<template>

    <crud-show title="user.apikeyTitle" :open="open" @close="$emit('close')">
        <v-btn v-if="apikey === null"
               :loading="loading"
               outlined color="blue"
               @click="getApikey"
        >
            {{$t('user.getApikey')}}
        </v-btn>
        <span v-else>{{apikey}}</span>
    </crud-show>

</template>

<script>
    import authProvider from "../../../providers/AuthProvider";
    import {ClientError, CrudShow} from "@dracul/common-frontend";

    export default {
        name: "UserApikey",
        components: {CrudShow},
        props: {
            user: Object,
            open: Boolean
        },
        data() {
            return {
                apikey: null,
                loading: false,
                errorMessage: null
            }
        },
        methods: {
            getApikey() {
                this.loading = true
                authProvider.apikey(this.user.id).then(r => {
                    this.apikey = r.data.apikey.token
                }).catch(error => {
                    let clientError = new ClientError(error)
                    this.errorMessage = clientError.i18nMessage
                }).finally(() => this.loading = false)
            }
        }
    }
</script>

<style scoped>

</style>
<template>

    <!--ERROR-->
    <ActivationError v-if="error" :error="error"/>

    <!--ACTIVATING-->
    <ActivationInProgress v-else-if="activationStatus === null"/>

    <!--ACTIVATION STATUS-->

    <ActivationSuccessful v-else-if="activationStatus === true "/>


</template>

<script>
    import {mapActions} from 'vuex'
    import ClientError from '../../errors/ClientError'
    import AuthProvider from '../../providers/AuthProvider';
    import jwt_decode from 'jwt-decode'
    import ActivationError from "./ActivationError";
    import ActivationInProgress from "./ActivationInProgress";
    import ActivationSuccessful from "./ActivationSuccessful";

    export default {
        name: "ActivationManager",
        components: {ActivationSuccessful, ActivationInProgress, ActivationError},
        data: () => {
            return {
                loading: false,
                validation: null,
                activationStatus: null,
                error: null
            }
        },
        methods: {
            ...mapActions(['verifyToken']),
            checkToken() {
                let payload
                try{
                    payload = jwt_decode(this.$route.params.token)
                }catch (e) {
                    return false
                }

                if (payload != undefined && payload.exp) {
                    let dateNow = new Date();
                    let dateToken = new Date(payload.exp * 1000)
                    if (dateNow < dateToken) {
                        return true
                    }
                }
                return false
            },
            activation() {
                this.loading = true
                AuthProvider.activation(this.$route.params.token).then(res => {
                    this.activationStatus = res.data.activationUser.status
                    this.verifyToken(res.data.activationUser.token)
                }).catch(err => {
                    let ce = new ClientError(err)
                    this.error = ce.i18nMessage
                }).finally(() => this.loading = false)
            }
        },
        mounted() {
            if (this.checkToken()) {
                this.activation()
            } else {
                this.error = this.$t('auth.invalidToken')
            }
        }
    }
</script>


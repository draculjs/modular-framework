<template>

    <v-form @keyup.enter.native="signIn">
        <v-alert :value="!!error" type="error" class="mb-3 pa-3">
            {{error}}
        </v-alert>
        <v-text-field
                type="text"
                v-model="form.username"
                :label="$t('user.label.username')"
                :placeholder="$t('user.label.username')"
                color="secondary"
        ></v-text-field>

        <v-text-field id="password"
                      type="password"
                      v-model="form.password"
                      :label="$t('user.label.password')"
                      :placeholder="$t('user.label.password')"
                      color="secondary"
        />

        <v-btn
                ref="loginBtn"
                :loading="loading"
                min-width="100%"
                color="secondary"
                class="onSecondary--text"
                @click="signIn" v-t="'auth.signIn'">
        </v-btn>

    </v-form>

</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex'

    export default {
        name: "LoginForm",

        data: () => {
            return {
                loading: false,
                error: null,
                form: {
                    username: null,
                    password: null
                }
            }
        },

        created() {
            if (this.isAuth) this.$router.push({name:'home'})
        },

        computed: {
            ...mapState({
                me: state => state.user.me
            }),
            ...mapGetters(['isAuth']),
        },
        methods: {
            ...mapActions(['login']),

            signIn() {
                this.loading = true
                this.login(this.form)
                    .then(() => {
                        this.$router.push({name:'home'})
                    })
                    .catch((err) => {
                        this.error = this.$t(err)
                    })
                    .finally(() =>
                        this.loading = false
                    )
            }
        }
    }
</script>
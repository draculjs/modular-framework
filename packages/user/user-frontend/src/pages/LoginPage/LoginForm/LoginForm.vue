<template>

  <v-form @keyup.enter.native="signIn" v-model="isFormValid">
    <v-alert :value="!!error" type="error" class="mb-3 pa-3">
      {{error}}
    </v-alert>
    <v-text-field
        type="text" outlined persistent-placeholder
        v-model="form.username"
        autocomplete="username"
        :label="$t('user.label.username')"
        color="secondary"
        :rules="[v => !!v || ' ']"
    ></v-text-field>

    <v-text-field id="password"
                  type="password" outlined persistent-placeholder
                  autocomplete="current-password"
                  v-model="form.password"
                  :label="$t('user.label.password')"
                  color="secondary"
                  :rules="[v => !!v || ' ']"
    />

      <v-btn
        :disabled="!isFormValid"
        ref="loginBtn"
        :loading="loading"
        min-width="100%"
        color="primary onPrimary--text"
        class="mt-3"
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
        username: "",
        password: ""
      },
      isFormValid: false,
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
    getRedirectParam(){
      return this.$route.query.redirect
    }
  },
  methods: {
    ...mapActions(['login']),
    signIn() {

      function b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
              return String.fromCharCode('0x' + p1);
            }));
      }

      this.loading = true
      this.login({
        username: this.form.username,
        password: b64EncodeUnicode(this.form.password),
      })
          .then(() => {
            if(this.getRedirectParam){
              this.$router.push(this.getRedirectParam)
            }else{
              this.$router.push({name:'home'}).catch(() => {});
            }

          })
          .catch((err) => {
            this.error = this.$t(err)
          })
          .finally(() => {
            this.loading = false
          })
    }
  }
}
</script>

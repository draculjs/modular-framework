<template>
  <div>
    <v-card class="elevation-12 ">

      <v-card-text class="pt-4 px-8 my-0 pb-0 text-center">
        <v-btn fab class="onPrimary--text" color="primary">
          <v-icon>lock</v-icon>
        </v-btn>
        <h2 class="mt-2">{{ $t('auth.signIn') }}</h2>
      </v-card-text>

      <v-card-text class="pt-5 px-8 pb-0">
        <slot></slot>
      </v-card-text>


      <v-card-text class="text-xs-left pt-2 pl-8 mt-0">
        <router-link class="secondary--text font-weight-bold" :to="{name: 'recoveryRequest'}"
                     v-t="'auth.forgotPassword'"></router-link>
      </v-card-text>
    </v-card>

    <v-card class="elevation-12 mt-2" v-if="isRegisterEnable">
      <v-card-text class="text-xs-center">
        <span> {{ $t('auth.stillNotUser') }}</span>
        <router-link :to="{name: 'register'}"
                     class="secondary--text font-weight-bold"
        >
          {{ $t('auth.signUp') }}
        </router-link>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

export default {
  name: "LoginCard",
  computed: {
    isRegisterEnable() {
      return process.env.VUE_APP_REGISTER === 'enable'
    }
  },

}
</script>

<template>

    <v-container v-if="isAuth" fluid fill-height >
      <v-row class="justify-center">
        <v-col cols="12" md="8" sm="6">
          <password-form></password-form>
        </v-col>
      </v-row>

    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'
    import PasswordForm from "../../forms/PasswordForm/PasswordForm.vue";


    export default {
        name: "PasswordPage",
        components: {PasswordForm},
        data: () => {
            return {
                passwordDialog: false
            }
        },
        computed: {
            ...mapGetters(['isAuth', 'me']),
        },
    }
</script>

<style scoped>

</style>

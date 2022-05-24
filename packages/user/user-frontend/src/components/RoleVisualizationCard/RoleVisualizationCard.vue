<template>
    <v-card outlined class="role-class">
          <v-card-text class="" v-if="sameLine">
            <strong>{{$t('role.role')}}</strong>: {{getRole}}
          </v-card-text>

          <v-card-text v-else>
            <strong>{{$t('role.role')}}</strong><br> {{getRole}}
          </v-card-text>

        </v-card>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
      props: {
        'sameLine' : Boolean
      },

      computed: {
          ...mapGetters(['getRole']),
      },
    }
</script>

<style scoped>
  .role-class{
    border: 0;
  }
</style>
<template>
    <v-card outlined class="role-class mt-n2 ml-n1">
          <v-card-text class="mb-n6 text-center">
            <v-icon>{{roleIcon}}</v-icon>
            <p>{{getRole}}</p>
          </v-card-text>
        </v-card>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        computed: {
            ...mapGetters([
                'getRole'
            ]),

            roleIcon(){
                return ((this.getRole === 'operator') ? 'mdi-account' : 'mdi-shield-account')
            }
        },
    }
</script>

<style scoped>
  .role-class{
    border: 0;
  }
</style>
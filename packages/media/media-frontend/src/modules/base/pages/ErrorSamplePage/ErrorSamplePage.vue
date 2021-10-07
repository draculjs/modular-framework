<template>
  <div>
    <h1>Errors Sample</h1>

    <v-btn class="ma-1" color="red" dark @click="errorNotAuthorized">Not Authorized</v-btn>
    <v-btn class="ma-1" color="blue" dark @click="errorAuthenticationError">Authentication Error</v-btn>
    <v-btn class="ma-1" color="purple" dark @click="errorApolloError">Internal Error</v-btn>
    <v-btn class="ma-1" color="orange" dark @click="errorUserInputError">User Input Error</v-btn>
    <v-btn class="ma-1" color="teal" dark @click="errorMulti">Multi</v-btn>
    <v-btn class="ma-1" color="cyan" dark @click="errorCustom">Custom</v-btn>
    <v-btn class="ma-1" color="brown" dark @click="getUnknownOperation">Unknown GVF</v-btn>
    <v-btn class="ma-1" color="pink" dark @click="getTimeout">TimeOut</v-btn>
    <v-btn class="ma-1" color="indigo" dark @click="getFail">Refuse</v-btn>
    <v-btn class="ma-1" color="black" dark @click="errorCustom">Network Error</v-btn>

    <v-row v-if="error">
      <v-col cols="12" md="6" v-for="(gqlError,i) in error.graphQLErrors" :key="i">
        <v-card >
            <v-simple-table  >
              <tbody>
              <tr>
                <th>Indice</th><td>{{i}}</td>
              </tr>
              <tr>
                <th>Path</th><td>{{gqlError.path}}</td>
              </tr>
              <tr>
                <th>Message</th><td>{{gqlError.message}}</td>
              </tr>
              <tr>
                <th>Code</th><td>{{gqlError.extensions.code}}</td>
              </tr>
              <tr v-if="gqlError.extensions.inputErrors">
                <th>

                  InputErrors</th>
                <td>
                <pre>{{ JSON.stringify(gqlError.extensions.inputErrors, undefined, 4)}}</pre>

                </td>
              </tr>
              </tbody>
            </v-simple-table>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import errorProvider from "@/modules/base/providers/ErrorProvider";

export default {
  name: "ErrorSamplePage",
  data(){
    return {
      error: null
    }
  },
  methods: {
    errorNotAuthorized() {
      errorProvider.getNotAuthorized()
          .catch(error => {
            console.log(error.graphQLErrors)
            this.error = error
          })
    },
    errorAuthenticationError() {
      errorProvider.getAuthenticationError()
          .catch(error => {
            console.log(error.graphQLErrors)
            this.error = error
          })
    },
    errorApolloError() {
      errorProvider.getApolloError()
          .catch(error => {
            console.log(error.graphQLErrors)
            this.error = error
          })
    },
    errorUserInputError() {
      errorProvider.getUserInputError()
          .catch(error => {
            console.log(error.graphQLErrors)
            this.error = error
          })
    },
    errorMulti() {
      errorProvider.getMultipleErrors()
          .catch(error => {
            //console.log(error.graphQLErrors)
            this.error = error
          })
    },
    errorCustom() {
      errorProvider.getCustomError()
          .catch(error => {
            //console.log(error.graphQLErrors)
            this.error = error
          })
    },
    getUnknownOperation(){
      errorProvider.getUnknownOperation()
          .catch(error => {
            console.log("LocalError getUnknownOperation",error)
            this.error = error
          })
    },
    getNetworkError(){
      errorProvider.getUnknownOperation()
          .catch(error => {
            console.log("LocalError getUnknownOperation",error)
            this.error = error
          })
    },
    getFail(){
      errorProvider.getFail()
          .catch(error => {
            console.log("LocalError getFail",error)
            this.error = error
          })
    },
    getTimeout(){
      console.log("Inicia Timeout")
      errorProvider.getTimeout()
          .then(() => {
            console.log("Then Timeout")
          })
          .catch(error => {
            console.log("LocalError getTimeout",error)
            this.error = error
          })
    }
  }
}
</script>

<style scoped>

</style>

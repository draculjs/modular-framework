import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import { setContext } from "apollo-link-context";
import store from '../store'
import {createUploadLink} from 'apollo-upload-client'
import {onError} from "apollo-link-error";
import {ApolloLink} from 'apollo-link'

const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors)
        graphQLErrors.forEach(
            (graphQlError, index) => {

                const {message, locations, path, extensions} = graphQlError

                //Show error on console
                console.error(`[GraphQL error]: Message: ${message}, Code: ${extensions.code}, Path: ${path}, Location ${locations}`)

                //Add error for errorSnackbar
                setTimeout(() => store.commit('addGraphqlError', graphQlError), 100 * (index + 1))

                //Handle UNAUTHENTICATED errors
                if (extensions.code === 'UNAUTHENTICATED') {
                    store.dispatch('checkAuth')
                }

            }
        );

    if (networkError) {
        console.error(`[Network error]: ${networkError}, message: ${networkError.message}`);
        //Add error for errorSnackbar
        setTimeout(() => store.commit('addGraphqlError', networkError), 10)

    }
});

const uploadLink = createUploadLink({
    uri: (process.env.VUE_APP_APIHOST ? process.env.VUE_APP_APIHOST : '') + '/graphql/',
})

const apolloLink = new ApolloLink((operation, forward) => {
    return forward(operation);
})


//Middleware for Authorization
const authLink = setContext(async (req, { headers }) => {
    let context = {headers: {...headers}}
    if(req.operationName != "refreshToken"){
        let sessionIsValid = await store.dispatch('validateSession')
        if (sessionIsValid) {
            context.headers.Authorization = 'bearer ' + store.getters.getToken
        }
    }
    return context
})


const link = ApolloLink.from([
    errorLink,
    authLink,
    apolloLink,
    uploadLink
]);

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
    link: link,
    cache,
})


export default apolloClient

import {ApolloClient} from 'apollo-client'
import {createUploadLink} from 'apollo-upload-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloLink} from 'apollo-link'
import store from '../store'

import {onError} from "apollo-link-error";

const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors)
        graphQLErrors.map(({message, locations, path}) =>
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

const uploadLink = createUploadLink({
    uri: (process.env.VUE_APP_APIHOST ? process.env.VUE_APP_APIHOST : '') + '/graphql/',
})

//Middleware for Authorization
const authLink = new ApolloLink((operation, forward) => {
    if (store.getters.getToken) {
        operation.setContext({
            headers: {
                Authorization: 'bearer ' + store.getters.getToken
            }
        });
    }
    return forward(operation);
})


const link = ApolloLink.from([
    errorLink,
    authLink,
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
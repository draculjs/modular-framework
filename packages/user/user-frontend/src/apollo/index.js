import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import store from '../store'
import jwt_decode from 'jwt-decode'


import {onError} from "apollo-link-error";
import authProvider from '../providers/AuthProvider'


const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

const uploadLink = createUploadLink({
    uri: process.env.VUE_APP_APIHOST + '/graphql/',
})

//Middleware for Authorization

const authLink = new ApolloLink(async (operation, forward) => {
    if (store.getters.getToken) {
        let tokenExpired
        try {
            let payload = jwt_decode(token)

            if (payload.exp) {
                let dateNow = new Date();
                let dateToken = new Date(payload.exp * 1000)
                if (dateNow < dateToken) {
                    tokenExpired = true
                }
            }
        }catch(err){
            console.error(err)
        }

        if(tokenExpired){
            try {
                let {token, expiryDate} = store.getters.getRefreshToken
                let newToken = await authProvider.refreshToken(token, expiryDate)
                store.mutation.setAccessToken(newToken)
            } catch (error) {
                console.error(error)
            }
        }

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
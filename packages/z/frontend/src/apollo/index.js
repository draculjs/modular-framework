import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloLink
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import createUploadLink  from 'apollo-upload-client/createUploadLink.mjs';
import { store } from '../store/index.js';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((graphQlError, index) => {
      const { message, locations, path, extensions } = graphQlError;
      
      console.error(`[GraphQL error]: Message: ${message}, Code: ${extensions?.code}, Path: ${path}, Location: ${locations}`);
      
      setTimeout(() => store.commit('addGraphqlError', graphQlError), 100 * (index + 1));
      
      if (extensions?.code === 'UNAUTHENTICATED') { 
        store.dispatch('checkAuth');
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}, message: ${networkError.message}`);
    setTimeout(() => store.commit('addGraphqlError', networkError), 10);
  }
});

const API_HOST = import.meta.env.VITE_APP_APIHOST || 'http://localhost:7777';
const GRAPHQL_ENDPOINT = `${API_HOST}/graphql`;

const uploadLink = createUploadLink({
  uri: GRAPHQL_ENDPOINT
});

const authLink = setContext(async (_, { headers }) => {
  const context = { headers: { ...headers } };
  
  if (store.getters.operationName !== "refreshToken") {
    const sessionIsValid = await store.dispatch('validateSession');
    if (sessionIsValid) {
      context.headers.Authorization = `Bearer ${store.getters.getToken}`;
    }
  }
  
  return context;
});

const link = ApolloLink.from([
  errorLink,
  authLink,
  uploadLink
]);

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    }
  }
});

export default apolloClient;
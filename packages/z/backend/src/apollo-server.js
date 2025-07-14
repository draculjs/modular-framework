import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLUpload } from 'graphql-upload';
import { resolvers } from './modules-merge.js';
import {typeDefs} from './modules-merge.js';

// Asegurar que typeDefs sea un array
const getTypeDefs = () => {
  if (Array.isArray(typeDefs)) {
    return typeDefs;
  }
  return [typeDefs];
};

const schema = makeExecutableSchema({
  typeDefs: [
    ...getTypeDefs(),
    `scalar Upload`
  ],
  resolvers: {
    ...resolvers,
    Upload: GraphQLUpload
  }
});

export const apolloServer = new ApolloServer({
  schema,
  plugins: [
    {
      async requestDidStart() {
        return {
          async didEncounterErrors(requestContext) {
            // Asegúrate de importar GqlErrorLog correctamente
            const { GqlErrorLog } = await import("@dracul/logger-backend");
            await GqlErrorLog(requestContext);
          },
          async willSendResponse(requestContext) {
            // Asegúrate de importar GqlResponseLog correctamente
            const { GqlResponseLog } = await import("@dracul/logger-backend");
            await GqlResponseLog(requestContext);
          }
        }
      }
    }
  ],
  formatError: (formattedError) => {
    return {
      ...formattedError,
      extensions: {
        ...formattedError.extensions,
        stacktrace: process.env.NODE_ENV === 'production' 
          ? undefined 
          : formattedError.extensions?.stacktrace
      }
    };
  },
  allowBatchedHttpRequests: true
});

export default apolloServer;
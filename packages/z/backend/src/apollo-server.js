import {ApolloServer} from 'apollo-server-express'
import {resolvers, typeDefs} from './modules-merge'
import {GqlErrorLog, GqlResponseLog} from "@dracul/logger-backend";

//Apollo Server
export const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        return {user: req.user, rbac: req.rbac, req}
    },
    plugins: [
        {
            requestDidStart(requestContext) {
                return {
                    didEncounterErrors(requestContext) {
                        GqlErrorLog(requestContext)
                    },
                    willSendResponse(requestContext) {
                        GqlResponseLog(requestContext)
                    }
                }
            }
        }
    ]
});

export default  apolloServer

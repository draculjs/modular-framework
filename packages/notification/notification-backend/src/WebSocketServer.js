import {ApolloServer} from 'apollo-server-express';
import {createServer} from 'http';
import express from 'express';

import {types, resolvers} from './graphql/index.js'

const WS_PORT = process.env.NOTIFICATION_WS_PORT ? process.env.NOTIFICATION_WS_PORT : 5555;
const WS_URL = process.env.NOTIFICATION_WS_URL ? process.env.NOTIFICATION_WS_URL : 'http://localhost';

const apolloServerSub = new ApolloServer({
    typeDefs: types,
    resolvers,
    subscriptions: {
        onConnect: () => console.log('Connected to websocket'),
        onDisconnect: () => console.log('Disconnected from websocket'),
        onError: (err) => console.error(err)
    },
    tracing: true,
});


export function startNotificacionWs(){
    const app = express();

    const websocketServer = createServer(app);

    apolloServerSub.applyMiddleware({app});
    apolloServerSub.installSubscriptionHandlers(websocketServer);

    websocketServer.listen(WS_PORT, () => console.log(
        `Websocket Server is now running on ${WS_URL}:${WS_PORT}`
    ));
}

export default startNotificacionWs

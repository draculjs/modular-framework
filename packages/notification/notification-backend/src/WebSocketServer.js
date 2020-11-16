import {createServer} from 'http';
const express = require('express');
const {ApolloServer} = require('apollo-server-express');
import {types, resolvers} from './graphql'

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


const startNotificacionWs = function () {

    const app = express();

    // Create WebSocket listener server
    const websocketServer = createServer(app);

    apolloServerSub.applyMiddleware({app});

    apolloServerSub.installSubscriptionHandlers(websocketServer);

    // Bind it to port and start listening
    websocketServer.listen(WS_PORT, () => console.log(
        `Websocket Server is now running on ${WS_URL}:${WS_PORT}`
    ));

}

export {startNotificacionWs}
export default startNotificacionWs

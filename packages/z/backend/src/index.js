import dotenv from 'dotenv';
dotenv.config();

import { DefaultLogger } from "@dracul/logger-backend";
import { userCreateListener } from "@dracul/media-backend";
import { expressApp } from './express-app.js';
import { apolloServer } from './apollo-server.js';
import initService from "./init/init-service.js";
import defaultRoute from "./routes/DefaultRoute.js";
import {mongoConnect} from './mongo-db.js';
import { expressMiddleware } from '@apollo/server/express4';

DefaultLogger.info("Starting APP");

async function startServer() {
    try {
        await mongoConnect();
        await initService();
        userCreateListener();
        
        await apolloServer.start();
        
        const GRAPHQL_PATH = '/graphql';
        
        // Middleware de Apollo Server
        expressApp.use(
            GRAPHQL_PATH,
            expressMiddleware(apolloServer, {
                context: async ({ req }) => {
                    // Asegúrate de pasar el contexto completo
                    return { 
                        req,
                        user: req.user,    // Asegúrate que esto está poblado
                        rbac: req.rbac     // Asegúrate que esto está poblado
                    };
                }
            })
        );

        expressApp.use(defaultRoute);

        const PORT = process.env.APP_PORT || "5000";
        const BASE_URL = process.env.APP_API_URL || `http://localhost:${PORT}`;

        const server = expressApp.listen(PORT, () => {
            DefaultLogger.info(`Web Server started: ${BASE_URL}`);
            DefaultLogger.info(`Graphql Server ready: ${BASE_URL}${GRAPHQL_PATH}`);
        });
        server.setTimeout(420000);
    } catch (err) {
        DefaultLogger.error(err.message, err);
        process.exit(1);
    }
}

startServer();
require('dotenv').config();

const mongoConnect = require('./mongo-db')
import {DefaultLogger} from "@dracul/logger-backend";
import expressApp from './express-app'
import apolloServer from './apollo-server'
import initService from "./init/init-service";
import defaultRoute from "./routes/DefaultRoute";
import { userCreateListener } from '@dracul/media-backend'


async function startApp(){

    try{
        DefaultLogger.info("Starting APP")

        userCreateListener()
        await mongoConnect()
        //Link ApolloServer with ExpressApp
        apolloServer.applyMiddleware({app: expressApp})

        //Default route to frontend web on monorepo strategy
        expressApp.use(defaultRoute)

        await initService()

        const PORT = process.env.APP_PORT ? process.env.APP_PORT : "5000"
        const URL = process.env.APP_API_URL ? process.env.APP_API_URL : "http://localhost" + PORT

        const server = expressApp.listen(PORT, () => {
            DefaultLogger.info(`Web Server started: ${URL}`)
            DefaultLogger.info(`Graphql Server ready: ${URL}${apolloServer.graphqlPath}`)
        })
        server.setTimeout(420000);
    }catch (error) {
        DefaultLogger.error(error.message, error)
    }


}


startApp()


require('dotenv').config();
import {DefaultLogger} from "@dracul/logger-backend";
import {userCreateListener} from "@dracul/media-backend";
import expressApp from './express-app'
import apolloServer from './apollo-server'
import initService from "./init/init-service";
import defaultRoute from "./routes/DefaultRoute";
import {graphqlUploadExpress} from 'graphql-upload'

const mongoConnect = require('./mongo-db')

DefaultLogger.info("Starting APP")

//Connect to MongoDb
mongoConnect()

userCreateListener()

expressApp.use(graphqlUploadExpress({maxFileSize: 1000000000, maxFiles: 10}))

//Link ApolloServer with ExpressApp
apolloServer.applyMiddleware({app: expressApp})

//Default route to frontend web on monorepo strategy
expressApp.use(defaultRoute)

//initialize permissions, roles, users, customs, seeds
initService()
    //After initialize start to listen request
    .then(() => {

    const PORT = process.env.APP_PORT ? process.env.APP_PORT : "5000"
    const URL = process.env.APP_API_URL ? process.env.APP_API_URL : "http://localhost" + PORT

    const server = expressApp.listen(PORT, () => {
        DefaultLogger.info(`Web Server started: ${URL}`)
        DefaultLogger.info(`Graphql Server ready: ${URL}${apolloServer.graphqlPath}`)
    })
    server.setTimeout(420000);

}).catch(err => {
    DefaultLogger.error(err.message, err)
})


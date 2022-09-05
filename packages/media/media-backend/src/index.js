require('dotenv').config();
import { DefaultLogger } from "@dracul/logger-backend";
DefaultLogger.info("Starting APP")

import express from 'express';
const mongoConnect = require('./mongo-db')
import { ApolloServer, GraphQLExtension } from 'apollo-server-express'
import { resolvers, typeDefs } from './modules-merge'
import path from 'path'
import { jwtMiddleware, corsMiddleware, rbacMiddleware, sessionMiddleware } from '@dracul/user-backend'

import { router as fileRouter } from './modules/media/rest/routers/FileRouter'
import initService from "./init/init-service";
import { ResponseTimeMiddleware, RequestMiddleware, GqlErrorLog, GqlResponseLog } from '@dracul/logger-backend'
import { updateFileMiddleware } from "./modules/media/middleware"
import { cronManager } from "./cron";
import { userCreateListener } from './modules/media/listeners/UserCreateListener'

import swaggerUi from 'swagger-ui-express'

userCreateListener();

const YAML = require('yamljs');

DefaultLogger.info(`Starting app`)

const app = express();



app.use(corsMiddleware)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(jwtMiddleware)
app.use(function (err, req, res, next) {
    if (err && err.name === 'UnauthorizedError') {
        DefaultLogger.warn(err.message)
    }
    next()
});

app.use(RequestMiddleware)
app.use(ResponseTimeMiddleware)
app.use(rbacMiddleware)
app.use(sessionMiddleware)
app.use('/media/files', updateFileMiddleware)

app.use('/api', fileRouter)

const swaggerDocument = YAML.load(__dirname + '/swagger.yaml'); 

let PORT = process.env.APP_PORT ? process.env.APP_PORT : "5000"
let API_URL = process.env.APP_API_URL ? process.env.APP_API_URL + "/api" : "http://localhost" + PORT + "/api"

API_URL = API_URL.includes('https://') ? API_URL.split('https://')[1] : API_URL
API_URL = API_URL.includes('http://') ? API_URL.split('http://')[1] : API_URL

swaggerDocument.host = API_URL;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

GraphQLExtension.didEncounterErrors

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        return { user: req.user, rbac: req.rbac, req }
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


apolloServer.applyMiddleware({ app })

//STATIC IMG
app.use('/media/avatar', express.static('media/avatar'));
app.use('/media/logo', express.static('media/logo'));
app.use('/media/files', express.static('media/files'));
app.use('/', express.static('web', { index: "index.html" }));

app.get('*', async function (request, response) {
    response.sendFile(path.resolve(__dirname, 'web/index.html'));
});

//Endpoint for monitoring
app.get('/status', function (req, res) {
    res.send("RUNNING")
})

//Connect to MongoDb
mongoConnect()
    //initialize permissions, roles, users, customs, seeds
    .then(initService)
    .then(() => {

    let PORT = process.env.APP_PORT ? process.env.APP_PORT : "5000"
    let URL = process.env.APP_API_URL ? process.env.APP_API_URL : "http://localhost" + PORT

    app.listen(process.env.APP_PORT, () => {
        DefaultLogger.info(`Server started: ${URL}`)
        DefaultLogger.info(`Graphql ready: ${URL}/graphql`)
    })

}).catch(err => {
    DefaultLogger.error(err.message, err)
})

cronManager();

export default app;

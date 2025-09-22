require('dotenv').config();
import express from 'express';

import { jwtMiddleware, rbacMiddleware, sessionMiddleware } from '@dracul/user-backend';
import { corsMiddleware } from '@dracul/access-backend'
import { ResponseTimeMiddleware, RequestMiddleware } from '@dracul/logger-backend';
import { FileRouter, usersStorageRouter } from '@dracul/media-backend';
import { updateFileMiddleware } from '@dracul/media-backend';
import unauthorizedErrorMiddleware from "./middlewares/UnauthorizedErrorMiddleware";
import ErrorHandlerMiddleware from "./middlewares/ErrorHandlerMiddleware";

import mediaRoute from "./routes/MediaRoute";
import statusRoute from "./routes/StatusRoute";

import { swaggerUiMiddleware, swaggerUiOptions } from '@dracul/media-backend';

export const expressApp = express();

//Middlewares
expressApp.use(corsMiddleware)
expressApp.use(express.json())
expressApp.use(jwtMiddleware)
expressApp.use(unauthorizedErrorMiddleware)
expressApp.use(RequestMiddleware)
expressApp.use(ResponseTimeMiddleware)
expressApp.use(rbacMiddleware)
expressApp.use(sessionMiddleware)
expressApp.use(updateFileMiddleware)

//Routes
expressApp.use(mediaRoute)
expressApp.use(statusRoute)

//Error handler Middleware
expressApp.use(ErrorHandlerMiddleware)


expressApp.use("/api", [FileRouter, usersStorageRouter])
expressApp.use("/api-docs", swaggerUiMiddleware, swaggerUiOptions)

export default expressApp



require('dotenv').config();
import express from 'express';

import {jwtMiddleware, corsMiddleware, rbacMiddleware, sessionMiddleware} from '@dracul/user-backend'
import {ResponseTimeMiddleware,RequestMiddleware} from '@dracul/logger-backend'
import unauthorizedErrorMiddleware from "./middlewares/UnauthorizedErrorMiddleware";
import ErrorHandlerMiddleware from "./middlewares/ErrorHandlerMiddleware";

import mediaRoute from "./routes/MediaRoute";
import statusRoute from "./routes/StatusRoute";

export const expressApp = express();

//Middlewares
expressApp.use(corsMiddleware)
expressApp.use(express.json())
expressApp.use(jwtMiddleware)
expressApp.use(unauthorizedErrorMiddleware);
expressApp.use(RequestMiddleware)
expressApp.use(ResponseTimeMiddleware)
expressApp.use(rbacMiddleware)
expressApp.use(sessionMiddleware)

//Routes
expressApp.use(mediaRoute)
expressApp.use(statusRoute)

//Error handler Middleware
expressApp.use(ErrorHandlerMiddleware);

export default expressApp

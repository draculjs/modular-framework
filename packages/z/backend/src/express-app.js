import {config} from 'dotenv';
config()
import express from 'express';
import { jwtMiddleware, rbacMiddleware, sessionMiddleware } from '@dracul/user-backend';
import { ResponseTimeMiddleware, RequestMiddleware } from '@dracul/logger-backend';
import { FileRouter, usersStorageRouter } from '@dracul/media-backend';
import { updateFileMiddleware } from '@dracul/media-backend';
import unauthorizedErrorMiddleware from "./middlewares/UnauthorizedErrorMiddleware.js";
import ErrorHandlerMiddleware from "./middlewares/ErrorHandlerMiddleware.js";

import mediaRoute from "./routes/MediaRoute.js";
import statusRoute from "./routes/StatusRoute.js";

import { swaggerUiMiddleware, swaggerUiOptions } from '@dracul/media-backend';
import { corsMiddleware } from '@dracul/user-backend';
import { graphqlUploadExpress } from 'graphql-upload';
import bodyParser from 'body-parser';

export const expressApp = express();

expressApp.use(corsMiddleware);

expressApp.use((req, res, next) => {
  if (req.headers['content-type']?.startsWith('multipart/form-data')) {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

expressApp.use(
  '/graphql', // Adjust if your GraphQL endpoint is different
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })
);

expressApp.use(express.urlencoded({ extended: true }));

expressApp.use(jwtMiddleware)
expressApp.use(unauthorizedErrorMiddleware)
expressApp.use(RequestMiddleware)
expressApp.use(ResponseTimeMiddleware)
expressApp.use(rbacMiddleware)
expressApp.use(sessionMiddleware)
expressApp.use(updateFileMiddleware)

expressApp.use(mediaRoute)
expressApp.use(statusRoute)
expressApp.use("/api", [FileRouter, usersStorageRouter])
expressApp.use("/api-docs", swaggerUiMiddleware, swaggerUiOptions)

expressApp.use(ErrorHandlerMiddleware)

export default expressApp
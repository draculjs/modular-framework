"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _loggerBackend = require("@dracul/logger-backend");

var _express = _interopRequireDefault(require("express"));

require("./mongo-db");

var _apolloServerExpress = require("apollo-server-express");

var _modulesMerge = require("./modules-merge");

var _path = _interopRequireDefault(require("path"));

var _userBackend = require("@dracul/user-backend");

var _FileRouter = require("./modules/media/rest/routers/FileRouter");

var _initService = _interopRequireDefault(require("./init/init-service"));

var _swaggerJsdoc = _interopRequireDefault(require("swagger-jsdoc"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

_loggerBackend.DefaultLogger.info("Starting APP");

_loggerBackend.DefaultLogger.info(`Starting app`);

const app = (0, _express.default)(); // const swaggerDocument = require('./swagger.json');

app.use(_loggerBackend.RequestMiddleware);
app.use(_loggerBackend.ResponseTimeMiddleware);
app.use(_userBackend.corsMiddleware);
app.use(_express.default.json());
app.use(_userBackend.jwtMiddleware);
app.use(_userBackend.rbacMiddleware);
app.use(_userBackend.sessionMiddleware);
app.use('/api', _FileRouter.router);
_apolloServerExpress.GraphQLExtension.didEncounterErrors;
const apolloServer = new _apolloServerExpress.ApolloServer({
  typeDefs: _modulesMerge.typeDefs,
  resolvers: _modulesMerge.resolvers,
  context: ({
    req
  }) => {
    return {
      user: req.user,
      rbac: req.rbac,
      req
    };
  },
  plugins: [{
    requestDidStart(requestContext) {
      return {
        didEncounterErrors(requestContext) {
          (0, _loggerBackend.GqlErrorLog)(requestContext);
        },

        willSendResponse(requestContext) {
          (0, _loggerBackend.GqlResponseLog)(requestContext);
        }

      };
    }

  }]
});
apolloServer.applyMiddleware({
  app
}); //STATIC IMG

app.use('/media/avatar', _express.default.static('media/avatar'));
app.use('/media/logo', _express.default.static('media/logo'));
app.use('/media/files', _express.default.static('media/files'));
app.use('/', _express.default.static('web', {
  index: "index.html"
})); //Endoint for swagger

let PORT = process.env.APP_PORT ? process.env.APP_PORT : "5000";
let URL = process.env.APP_API_URL ? process.env.APP_API_URL : "http://localhost" + PORT;
const urlBackend = URL;
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'API Scaffold',
      description: 'Documentando API con Swagger',
      contact: {
        name: "Scaffold",
        url: "#",
        email: "-"
      },
      license: {
        name: "-",
        url: "-"
      },
      servers: [urlBackend]
    }
  },
  //  ['.routes/*.js']
  apis: ["./index.js", './src/modules/media/rest/routers/FileRouter.js']
};
const swaggerDocs = (0, _swaggerJsdoc.default)(swaggerOptions);
app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(swaggerDocs)); // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('*', function (request, response) {
  response.sendFile(_path.default.resolve(__dirname, 'web/index.html'));
}); //Endpoint for monitoring

app.get('/status', function (req, res) {
  res.send("RUNNING");
}); //initialize permissions, roles, users, customs, seeds

(0, _initService.default)().then(() => {
  let PORT = process.env.APP_PORT ? process.env.APP_PORT : "5000";
  let URL = process.env.APP_API_URL ? process.env.APP_API_URL : "http://localhost" + PORT;
  app.listen(process.env.APP_PORT, () => {
    _loggerBackend.DefaultLogger.info(`Server started: ${URL}`);

    _loggerBackend.DefaultLogger.info(`Graphql ready: ${URL}/graphql`);
  });
}).catch(err => {
  _loggerBackend.DefaultLogger.error(err.message, err);
});
var _default = app;
exports.default = _default;
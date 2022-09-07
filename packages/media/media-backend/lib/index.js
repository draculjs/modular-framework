"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _loggerBackend = require("@dracul/logger-backend");

var _express = _interopRequireDefault(require("express"));

var _apolloServerExpress = require("apollo-server-express");

var _modulesMerge = require("./modules-merge");

var _path = _interopRequireDefault(require("path"));

var _userBackend = require("@dracul/user-backend");

var _FileRouter = require("./modules/media/rest/routers/FileRouter");

var _initService = _interopRequireDefault(require("./init/init-service"));

var _middleware = require("./modules/media/middleware");

var _cron = require("./cron");

var _UserCreateListener = require("./modules/media/listeners/UserCreateListener");

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

_loggerBackend.DefaultLogger.info("Starting APP");

const mongoConnect = require('./mongo-db');

(0, _UserCreateListener.userCreateListener)();

const YAML = require('yamljs');

_loggerBackend.DefaultLogger.info(`Starting app`);

const app = (0, _express.default)();
app.use(_userBackend.corsMiddleware);
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));
app.use(_userBackend.jwtMiddleware);
app.use(function (err, req, res, next) {
  if (err && err.name === 'UnauthorizedError') {
    _loggerBackend.DefaultLogger.warn(err.message);
  }

  next();
});
app.use(_loggerBackend.RequestMiddleware);
app.use(_loggerBackend.ResponseTimeMiddleware);
app.use(_userBackend.rbacMiddleware);
app.use(_userBackend.sessionMiddleware);
app.use('/media/files', _middleware.updateFileMiddleware);
app.use('/api', _FileRouter.router);
const swaggerDocument = YAML.load(__dirname + '/swagger.yaml');
let PORT = process.env.APP_PORT ? process.env.APP_PORT : "5000";
let API_URL = process.env.APP_API_URL ? process.env.APP_API_URL + "/api" : "http://localhost" + PORT + "/api";
API_URL = API_URL.includes('https://') ? API_URL.split('https://')[1] : API_URL;
API_URL = API_URL.includes('http://') ? API_URL.split('http://')[1] : API_URL;
swaggerDocument.host = API_URL;
app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(swaggerDocument));
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
}));
app.get('*', async function (request, response) {
  response.sendFile(_path.default.resolve(__dirname, 'web/index.html'));
}); //Endpoint for monitoring

app.get('/status', function (req, res) {
  res.send("RUNNING");
}); //Connect to MongoDb

mongoConnect() //initialize permissions, roles, users, customs, seeds
.then(_initService.default).then(() => {
  let PORT = process.env.APP_PORT ? process.env.APP_PORT : "5000";
  let URL = process.env.APP_API_URL ? process.env.APP_API_URL : "http://localhost" + PORT;
  app.listen(process.env.APP_PORT, () => {
    _loggerBackend.DefaultLogger.info(`Server started: ${URL}`);

    _loggerBackend.DefaultLogger.info(`Graphql ready: ${URL}/graphql`);
  });
}).catch(err => {
  _loggerBackend.DefaultLogger.error(err.message, err);
});
(0, _cron.cronManager)();
var _default = app;
exports.default = _default;
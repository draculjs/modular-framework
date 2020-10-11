"use strict";

var _express = _interopRequireDefault(require("express"));

require("./mongo-db");

var _apolloServerExpress = require("apollo-server-express");

var _modulesMerge = require("./modules-merge");

var _path = _interopRequireDefault(require("path"));

var _api = require("@ci-user-module/api");

var _logger = require("./logger");

var _FileRouter = require("./modules/media/rest/routers/FileRouter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const app = (0, _express.default)();
app.use(_api.corsMiddleware);
app.use(_express.default.json());
app.use(_api.jwtMiddleware);
app.use(_api.rbacMiddleware);
app.use(_logger.expressRequestLogger);
app.use(_api.sessionMiddleware);
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
          (0, _logger.graphqlErrorLogger)(requestContext);
        },

        willSendResponse(requestContext) {
          (0, _logger.graphqlResponseLogger)(requestContext);
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
app.get('*', function (request, response) {
  response.sendFile(_path.default.resolve(__dirname, 'web/index.html'));
}); //status

app.get('/status', function (req, res) {
  res.send("RUNNING");
});
app.listen(process.env.APP_PORT, () => console.log(`Server started: http://localhost:${process.env.APP_PORT}`));
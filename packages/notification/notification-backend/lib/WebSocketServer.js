"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startNotificacionWs = exports["default"] = void 0;

var _http = require("http");

var _graphql = require("./graphql");

var express = require('express');

var _require = require('apollo-server-express'),
    ApolloServer = _require.ApolloServer;

var WS_PORT = process.env.NOTIFICATION_WS_PORT ? process.env.NOTIFICATION_WS_PORT : 5555;
var WS_URL = process.env.NOTIFICATION_WS_URL ? process.env.NOTIFICATION_WS_URL : 'http://localhost';
var apolloServerSub = new ApolloServer({
  typeDefs: _graphql.types,
  resolvers: _graphql.resolvers,
  subscriptions: {
    onConnect: function onConnect() {
      return console.log('Connected to websocket');
    },
    onDisconnect: function onDisconnect() {
      return console.log('Disconnected from websocket');
    },
    onError: function onError(err) {
      return console.error(err);
    }
  },
  tracing: true
});

var startNotificacionWs = function startNotificacionWs() {
  var app = express(); // Create WebSocket listener server

  var websocketServer = (0, _http.createServer)(app);
  apolloServerSub.applyMiddleware({
    app: app
  });
  apolloServerSub.installSubscriptionHandlers(websocketServer); // Bind it to port and start listening

  websocketServer.listen(WS_PORT, function () {
    return console.log("Websocket Server is now running on ".concat(WS_URL, ":").concat(WS_PORT));
  });
};

exports.startNotificacionWs = startNotificacionWs;
var _default = startNotificacionWs;
exports["default"] = _default;
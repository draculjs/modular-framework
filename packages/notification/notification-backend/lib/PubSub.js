"use strict";

var _require = require('graphql-subscriptions'),
  PubSub = _require.PubSub;
var pubsub = new PubSub();
module.exports.pubsub = pubsub;
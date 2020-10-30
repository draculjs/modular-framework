"use strict";

const mongoose = require("mongoose");

const config = {
  payloadRefType: mongoose.Types.UUID,
  queueCollection: 'queue',
  blockDuration: 30000,
  maxRetries: 3
};
module.exports = config;
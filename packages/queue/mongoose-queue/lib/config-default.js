"use strict";

const dotenv = require('dotenv');

dotenv.config();
const config = {
  blockDuration: process.env.BLOCK_DURATION ? process.env.BLOCK_DURATION : 30000,
  maxRetries: process.env.MAX_RETRIES ? process.env.MAX_RETRIES : 3
};
module.exports = config;
"use strict";

const mongoose = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");

const uniqueValidator = require("mongoose-unique-validator");

const {
  Schema
} = mongoose;
const userStorageSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    unique: true
  },
  capacity: {
    type: Number,
    required: true
  },
  usedSpace: {
    type: Number,
    required: false
  },
  maxFileSize: {
    type: Number,
    required: false
  },
  fileExpirationTime: {
    type: Number,
    required: false
  }
});
userStorageSchema.plugin(mongoosePaginate);
userStorageSchema.plugin(uniqueValidator, {
  message: "validation.unique"
});
const userStorage = mongoose.model("userStorage", userStorageSchema);
module.exports = userStorage;
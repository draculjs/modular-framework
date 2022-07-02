"use strict";

var _commonBackend = require("@dracul/common-backend");

const mongoosePaginate = require("mongoose-paginate-v2");

const uniqueValidator = require("mongoose-unique-validator");

const {
  Schema
} = _commonBackend.mongoose;
const userStorageSchema = new Schema({
  user: {
    type: _commonBackend.mongoose.Schema.Types.ObjectId,
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
  },
  //in days
  deleteByLastAccess: {
    type: Boolean,
    required: false,
    default: true
  },
  deleteByCreatedAt: {
    type: Boolean,
    required: false,
    default: false
  }
});
userStorageSchema.plugin(mongoosePaginate);
userStorageSchema.plugin(uniqueValidator, {
  message: "validation.unique"
});

const userStorage = _commonBackend.mongoose.model("userStorage", userStorageSchema);

module.exports = userStorage;
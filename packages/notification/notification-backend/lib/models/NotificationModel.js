"use strict";

var _commonBackend = require("@dracul/common-backend");
var mongoosePaginate = require("mongoose-paginate-v2");
var Schema = _commonBackend.mongoose.Schema;
var NotificationSchema = new Schema({
  user: {
    type: _commonBackend.mongoose.Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    "default": false
  },
  creationDate: {
    type: Date,
    required: true
  },
  readDate: {
    type: Date,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  icon: {
    type: String,
    required: false,
    "default": "notifications"
  }
});
NotificationSchema.plugin(mongoosePaginate);
var Notification = _commonBackend.mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
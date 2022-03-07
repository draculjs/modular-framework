"use strict";

var mongoose = require("mongoose");

var mongoosePaginate = require("mongoose-paginate-v2");

var Schema = mongoose.Schema;
var NotificationSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
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
var Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
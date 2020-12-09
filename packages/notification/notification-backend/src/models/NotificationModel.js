const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  creationDate: { type: Date, required: true },
  readDate: { type: Date, required: false },
  type: { type: String, required: false },
  icon: { type: String, required: false, default:"notifications" },
});

NotificationSchema.plugin(mongoosePaginate)
const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;

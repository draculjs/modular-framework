import mongoosePaginate from "mongoose-paginate-v2";
import {mongoose} from '@dracul/common-backend';
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

export const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;

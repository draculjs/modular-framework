import {mongoose} from '@dracul/common-backend';

import mongoosePaginate from "mongoose-paginate-v2";
const { Schema } = mongoose;

const userStorageSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, unique: true },
  capacity: { type: Number, required: true },
  usedSpace: { type: Number, required: false },
  maxFileSize: { type: Number, required: false },
  fileExpirationTime: { type: Number, required: false }, //in days
  deleteByLastAccess: { type: Boolean, required: false, default: true },
  deleteByCreatedAt: { type: Boolean, required: false, default: false },
});

userStorageSchema.plugin(mongoosePaginate);

export const userStorage = mongoose.model("userStorage", userStorageSchema);
export default userStorage;

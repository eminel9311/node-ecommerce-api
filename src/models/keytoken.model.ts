//!dmbgum
import mongoose, { Schema } from 'mongoose';

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

const keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'Shop',
    },
    publicKey: {
      type: String,
      require: true,
    },
    privateKey: {
      type: String,
      require: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [], // nhung RT da duoc su dung
    },
    refreshToken: {
      type: String,
      require: true
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
export default mongoose.model(DOCUMENT_NAME, keyTokenSchema);

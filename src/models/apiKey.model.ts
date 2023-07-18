//!dmbgum
import mongoose from 'mongoose';

const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'Apikeys';

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      require: true,
      ref: 'Shop',
    },
    status: {
      type: Boolean,
      default: true,
    },
    permission: {
      type: [String],
      require: true,
      enum: ['0000', '1111', '2222'],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
export default mongoose.model(DOCUMENT_NAME, apiKeySchema);

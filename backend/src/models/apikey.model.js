import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  key: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    default: 'Default Key',
  },
  cap: {
    type: Number,
    required: true,
    default: 10, // Max tokens
  },
  rate: {
    type: Number,
    required: true,
    default: 2, // Tokens per second (fill rate)
  },
}, {
  timestamps: true,
});

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

export default ApiKey;

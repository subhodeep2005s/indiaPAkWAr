import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['verified', 'unverified', 'false'],
    default: 'unverified',
  },
  imageUrl: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Post || mongoose.model('Post', postSchema); 
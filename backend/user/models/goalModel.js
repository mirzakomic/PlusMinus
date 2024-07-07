import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  name: String,
  targetAmount: Number,
  currentAmount: { type: Number, default: 0 },
  targetDate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Goal', goalSchema);
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  interval: { type: String, enum: ['monthly', 'yearly'] },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Subscription', subscriptionSchema);
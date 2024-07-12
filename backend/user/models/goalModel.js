import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  name: String,
  targetAmount: Number,
  installments: Number,
  monthlyInstallment: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Goal', goalSchema);
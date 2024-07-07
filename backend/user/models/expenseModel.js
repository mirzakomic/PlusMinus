import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  category: String,
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Expense', expenseSchema);
import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now } // Ensure you have a date field
});

const Income = mongoose.model('Income', incomeSchema);
export default Income;
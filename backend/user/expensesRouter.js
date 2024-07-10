import { Router } from "express";
import path from "path";
import multer from "multer";
import crypto from 'crypto';
import { default as FormData } from 'form-data';
import Mailgun from "mailgun.js";
import User from "./models/userModel.js";
import Expense from './models/expenseModel.js';
import Subscription from './models/subscriptionModel.js';
import Goal from './models/goalModel.js';
import { authenticateToken, generateAccessToken } from "./authToken.js";
import { createResetToken, validateResetToken } from "./models/resetTokenModel.js";
import dotenv from "dotenv"

const __dirname = path.resolve();
const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.join(__dirname, envPath) });

export const expensesRouter = Router();

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_SENDING_KEY});

const multerMiddleware = multer();

const hoursInMillisec = (hours) => {
  return 1000 * 60 * 60 * hours;
};

console.log(`Mailgun domain: ${process.env.MAILGUN_DOMAIN}`);
// expensesRouter.post('/expenses', authenticateToken, async (req, res) => {
//     const { category, description, amount } = req.body;
//     try {
//       const expense = new Expense({ category, description, amount, user: req.user.id });
//       await expense.save();
//       res.status(201).send(expense);
//     } catch (error) {
//       res.status(500).send({ error: 'Failed to create expense' });
//     }
//   });
  
  expensesRouter.get('/expenses', authenticateToken, async (req, res) => {
    try {
      const expenses = await Expense.find({ user: req.user.id });
      res.send(expenses);
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch expenses' });
    }
  });

expensesRouter.post('/expenses', authenticateToken, async (req, res) => {
  const { category, description, amount } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Create new expense
    const expense = new Expense({ category, description, amount, user: req.user.id });
    await expense.save();

    // Update user balance
    user.balance -= amount;
    await user.save();

    res.status(201).send({ expense, newBalance: user.balance });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create expense' });
  }
});

expensesRouter.get('/expensereport', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    const expenses = await Expense.find({
      userId,
      date: { $gte: start, $lt: end }
    });

    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    res.status(200).json({ totalExpenses });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch monthly expenses' });
  }
});

  
  expensesRouter.put('/expenses/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { category, description, amount } = req.body;
    try {
      const expense = await Expense.findByIdAndUpdate(id, { category, description, amount }, { new: true });
      res.send(expense);
    } catch (error) {
      res.status(500).send({ error: 'Failed to update expense' });
    }
  });
  
  expensesRouter.delete('/expenses/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await Expense.findByIdAndDelete(id);
      res.send({ message: 'Expense deleted' });
    } catch (error) {
      res.status(500).send({ error: 'Failed to delete expense' });
    }
  });
  
  // Subscriptions Routes
  expensesRouter.post('/subscriptions', authenticateToken, async (req, res) => {
    const { name, amount, interval, startDate, endDate } = req.body;
    try {
      const subscription = new Subscription({ name, amount, interval, startDate, endDate, user: req.user.id });
      await subscription.save();
      res.status(201).send(subscription);
    } catch (error) {
      res.status(500).send({ error: 'Failed to create subscription' });
    }
  });
  
  expensesRouter.get('/subscriptions', authenticateToken, async (req, res) => {
    try {
      const subscriptions = await Subscription.find({ user: req.user.id });
      res.send(subscriptions);
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch subscriptions' });
    }
  });
  
  expensesRouter.put('/subscriptions/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, amount, interval, startDate, endDate } = req.body;
    try {
      const subscription = await Subscription.findByIdAndUpdate(id, { name, amount, interval, startDate, endDate }, { new: true });
      res.send(subscription);
    } catch (error) {
      res.status(500).send({ error: 'Failed to update subscription' });
    }
  });
  
  expensesRouter.delete('/subscriptions/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await Subscription.findByIdAndDelete(id);
      res.send({ message: 'Subscription deleted' });
    } catch (error) {
      res.status(500).send({ error: 'Failed to delete subscription' });
    }
  });
  
  // Goals Routes
  expensesRouter.post('/goals', authenticateToken, async (req, res) => {
    const { name, targetAmount, targetDate } = req.body;
    try {
      const goal = new Goal({ name, targetAmount, targetDate, user: req.user.id });
      await goal.save();
      res.status(201).send(goal);
    } catch (error) {
      res.status(500).send({ error: 'Failed to create goal' });
    }
  });
  
  expensesRouter.get('/goals', authenticateToken, async (req, res) => {
    try {
      const goals = await Goal.find({ user: req.user.id });
      res.send(goals);
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch goals' });
    }
  });
  
  expensesRouter.put('/goals/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, targetAmount, currentAmount, targetDate } = req.body;
    try {
      const goal = await Goal.findByIdAndUpdate(id, { name, targetAmount, currentAmount, targetDate }, { new: true });
      res.send(goal);
    } catch (error) {
      res.status(500).send({ error: 'Failed to update goal' });
    }
  });
  
  expensesRouter.delete('/goals/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await Goal.findByIdAndDelete(id);
      res.send({ message: 'Goal deleted' });
    } catch (error) {
      res.status(500).send({ error: 'Failed to delete goal' });
    }
  });
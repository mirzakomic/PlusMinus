import express from 'express';
import Income from './models/incomeModel.js';
import { authenticateToken } from "./authToken.js";

export const incomeRouter = express.Router();

incomeRouter.get('/incomefetch', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    const incomes = await Income.find({
      userId,
      date: { $gte: start, $lt: end }
    });

    const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);
    res.status(200).json({ totalIncome });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch monthly income' });
  }
});

export default incomeRouter;
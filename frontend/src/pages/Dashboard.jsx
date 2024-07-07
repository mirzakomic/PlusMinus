import React, { useContext, useState, useEffect } from 'react';
import { UserContext }from '../providers/UserContext';
import axiosInstance from '../utils/axiosInstance';
import Button from '../components/Button';
import ListItem from '../components/ListItem';

const Dashboard = () => {
  const { user, setUser, expenses, setExpenses, subscriptions, setSubscriptions, customCategories,
    setCustomCategories } = useContext(UserContext);
  const [newExpense, setNewExpense] = useState({ category: '', description: '', amount: '' });
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const expenseFields = ['category', 'description', 'amount']; 
  const predefinedCategories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Education'];

useEffect(() => {
    setCategories([...predefinedCategories, ...customCategories]);
  }, [customCategories]);

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/expenses/expenses', newExpense);
      setExpenses([...expenses, response.data]);
      setNewExpense({ category: '', description: '', amount: '' });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const addCustomCategory = async () => {
    try {
      const response = await axiosInstance.post('/user/customcategory', {
        userId: user.id,
        category: customCategory
      });
      console.log(user._id);
      setUser({ ...user, customCategories: response.data });
    setCustomCategories(response.data);
    setCustomCategory('');
    } catch (error) {
      console.error('Error adding custom category:', error);
    }
  };

  const toggleSubscriptions = () => setShowSubscriptions(!showSubscriptions);

  return (
    <div className="dashboard">
      <h1>Financial Dashboard</h1>
      <form className='bg-slate-500' onSubmit={addExpense}>
      <select
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New Category"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
        />
        <Button type="button" onClick={addCustomCategory}>
          Add Custom Category
        </Button>
        <input
          type="text"
          placeholder="Description"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
        />
        <Button type="submit">Add Expense</Button>
      </form>

      <Button onClick={toggleSubscriptions}>
        {showSubscriptions ? 'Hide Subscriptions' : 'Manage Subscriptions'}
      </Button>

      {showSubscriptions && (
        <div className="subscriptions">
          {/* Subscriptions management logic */}
        </div>
      )}

      <div className="expenses-list">
        {expenses.map((expense) => (
          <ListItem key={expense._id} fields={expenseFields} data={expense} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useContext, useState, useEffect } from 'react';
import { UserContext }from '../providers/UserContext';
import axiosInstance from '../utils/axiosInstance';
import Button from '../components/Button';
import ListItem from '../components/ListItem';
import Background from '../assets/images/meshgradientbg.svg'

const Dashboard = () => {
  const { user, setUser, expenses, setExpenses, subscriptions, setSubscriptions, customCategories,
    setCustomCategories, income } = useContext(UserContext);
  const [newExpense, setNewExpense] = useState({ category: '', description: '', amount: '' });
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [showAddCustomCat, setShowAddCustomCat] = useState(false);
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
      setExpenses([...expenses, response.data.expense]);
      setNewExpense({ category: '', description: '', amount: '' });
      setUser({ ...user, balance: response.data.newBalance });
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
  const toggleAddCustomCat = () => setShowAddCustomCat(!showAddCustomCat);

    // Calculate total expenses
    const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount || 0), 0);

    // Calculate balance
    const balance = income ? (income - totalExpenses) : -totalExpenses;

  return (
    <div className="dashboard">
      <h1>Financial Dashboard</h1>
      <div style={{ backgroundImage: `url(${Background})` }} className='w-full bg-cover flex'>
      <form className='gap-3 flex flex-col' onSubmit={addExpense}>
        <div className='flex flex-row gap-3'>
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
        <Button size="small" onClick={toggleAddCustomCat}>{!showAddCustomCat ? '+ custom category' : '- custom category'}</Button>
        {showAddCustomCat && (
          <>
        <input
        type="text"
        placeholder="New Category"
        value={customCategory}
        onChange={(e) => setCustomCategory(e.target.value)}
      />
        <Button type="button" onClick={addCustomCategory}>
          Add Custom Category
        </Button>
        </>
      )}
      </div>
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
      </div>

      <Button onClick={toggleSubscriptions}>
        {showSubscriptions ? 'Hide Subscriptions' : 'Manage Subscriptions'}
      </Button>

      {showSubscriptions && (
        <div className="subscriptions">
          {/* Subscriptions management logic */}
        </div>
      )}

<h3>Monthly Income:</h3>
      <h3>{income}</h3>
      <h3>Balance:</h3>
      <h3>{balance}</h3> {/* Display the calculated balance */}
      <div className="expenses-list">
        {expenses.map((expense) => (
          <ListItem key={expense._id} fields={expenseFields} data={expense} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
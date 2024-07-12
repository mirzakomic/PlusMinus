import React, { useContext, useState } from 'react';
import { UserContext } from '../providers/UserContext';
import axiosInstance from '../utils/axiosInstance';
import Button from '../components/Button';
import ListItem from '../components/ListItem';

const Goals = () => {
  const { goals, setGoals } = useContext(UserContext);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    installments: ''
  });
  const goalFields = ['name', 'targetAmount', 'installments', 'monthlyInstallment']; 


  const addGoal = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/expenses/goals', newGoal);
      setGoals([...goals, response.data]);
      // Clear the form
      setNewGoal({
        name: '',
        targetAmount: '',
        installments: ''
      });
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/expenses/goals/${id}`);
      setGoals(goals.filter(goal => goal._id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <div className="goals">
      <h2>Goals</h2>
      <form onSubmit={addGoal}>
        <input
          type="text"
          placeholder="Goal Name"
          value={newGoal.name}
          onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Target Amount"
          value={newGoal.targetAmount}
          onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
        />
        <input
          type="number"
          placeholder="Installments (Months)"
          value={newGoal.installments}
          onChange={(e) => setNewGoal({ ...newGoal, installments: e.target.value })}
        />
        <Button showToast={true} toastText="Goal has been added" type="submit">Add Goal</Button>
      </form>

      <div className="goals-list">
        {goals.map((goal) => (
          <ListItem key={goal._id} fields={goalFields} data={goal} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default Goals;
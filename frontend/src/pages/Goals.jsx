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
    currentAmount: 0,
    targetDate: ''
  });
  const goalFields = ['name', 'targetAmount', 'currentAmount', 'targetDate']; 

  const addGoal = async (e) => {
    e.preventDefault();
    try {
      // Post to the correct endpoint for goals
      const response = await axiosInstance.post('/expenses/goals', newGoal);
      setGoals([...goals, response.data]);
      // Clear the form
      setNewGoal({
        name: '',
        targetAmount: '',
        currentAmount: 0,
        targetDate: ''
      });
    } catch (error) {
      console.error('Error adding goal:', error);
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
          placeholder="Current Amount"
          value={newGoal.currentAmount}
          onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
        />
        <input
          type="date"
          placeholder="Target Date"
          value={newGoal.targetDate}
          onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
        />
        <Button type="submit">Add Goal</Button>
      </form>

      <div className="goals-list">
        {goals.map((goal) => (
          <ListItem key={goal._id} fields={goalFields} data={goal} />
        ))}
      </div>
    </div>
  );
};

export default Goals;
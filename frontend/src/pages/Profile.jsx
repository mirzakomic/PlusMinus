import React, { useContext, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { UserContext } from '../providers/UserContext';
import Button from '../components/Button';

const UpdateIncome = () => {
  const { user, setUser } = useContext(UserContext);
  const [monthlyIncome, setMonthlyIncome] = useState(user.monthlyIncome || 0);

  const handleIncomeUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put('/user/income', { monthlyIncome });
      setUser(response.data);
    } catch (error) {
      console.error('Error updating monthly income:', error);
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <h2>Update Monthly Income</h2>
      <form onSubmit={handleIncomeUpdate}>
        <input
          type="number"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(e.target.value)}
          placeholder="Enter monthly income"
        />
        <Button type="submit">Update Income</Button>
      </form>
    </div>
  );
};

export default UpdateIncome;
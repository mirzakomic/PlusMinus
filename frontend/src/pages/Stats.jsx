import React, { useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { UserContext } from '../providers/UserContext';

const Stats = () => {
  const { expenses } = useContext(UserContext);

  const data = {
    labels: [...new Set(expenses.map(expense => expense.category))],
    datasets: [{
      data: expenses.reduce((acc, expense) => {
        const index = acc.findIndex(item => item.category === expense.category);
        if (index === -1) {
          acc.push({ category: expense.category, amount: expense.amount });
        } else {
          acc[index].amount += expense.amount;
        }
        return acc;
      }, []).map(item => item.amount),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF6384', '#36A2EB']
    }]
  };

  return (
    <div className="stats">
      <h2>Stats</h2>
      <Doughnut data={data} />
    </div>
  );
};

export default Stats;
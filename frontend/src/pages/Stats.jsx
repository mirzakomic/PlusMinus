import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
);


import React, { useContext, useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axiosInstance from '../utils/axiosInstance';
import { UserContext } from '../providers/UserContext';
import { Doughnut } from 'react-chartjs-2';


const Stats = () => {
  const { user } = useContext(UserContext);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axiosInstance.get('/expenses/expenses');
        const expenses = response.data;

        const categories = Array.from(new Set(expenses.map(expense => expense.category)));
        const amounts = categories.map(category =>
          expenses.filter(expense => expense.category === category)
                  .reduce((sum, expense) => sum + expense.amount, 0)
        );

        setChartData({
          labels: categories,
          datasets: [
            {
              label: 'Expenses',
              data: amounts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [user]);

  return (
    <div className="chart-container">
      <h1>Statistics</h1>
      <Doughnut data={chartData} />
    </div>
  );
};

export default Stats;
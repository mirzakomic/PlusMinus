import { useNavigate } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Loader from  '../components/Loader'

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shouldRefetch, _refetch] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //* Finance States
  const [expenses, setExpenses] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [income, setIncome] = useState(null);
  const [balance, setBalance] = useState(null);
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);

  const refetch = () => _refetch((prev) => !prev);

  const logout = async () => {
    try {
      console.log('Trying to log out');
      await axiosInstance.get('/user/logout');
      console.log('Cookie cleared, logging out');
      setUser(null);
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get('/user/secure');
        setUser(data);
        setIsLoggedIn(true);

        const expensesResponse = await axiosInstance.get('/expenses/expensereport');
        setExpenses(expensesResponse.data.expenses);
        setTotalMonthlyExpenses(expensesResponse.data.totalExpenses);

        const customCatResponse = await axiosInstance.get('/user/customcategoryfetch');
        setCustomCategories(customCatResponse.data.customCategories);

        const subscriptionsResponse = await axiosInstance.get('/expenses/subscriptions');
        setSubscriptions(subscriptionsResponse.data);

        const goalsResponse = await axiosInstance.get('/expenses/goals');
        setGoals(goalsResponse.data);

        const incomeResponse = await axiosInstance.get('/user/incomefetch');
        setIncome(incomeResponse.data.monthlyIncomeValue);
        console.log(income);
      } catch (error) {
        setUser(null);
        setIsLoggedIn(false);
        console.error("Error fetching user data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [shouldRefetch]);

  useEffect(() => {
  if (income !== null) {
    const calculatedBalance = income - totalMonthlyExpenses;
    setBalance(calculatedBalance);
  }
}, [income, totalMonthlyExpenses]);

  const updateIncome = async (newIncome) => {
    try {
      const response = await axiosInstance.put('/user/income', { monthlyIncome: newIncome });
      setUser(response.data);
      setIncome(newIncome);
    } catch (error) {
      console.error('Error updating monthly income:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, refetch, logout, expenses, setExpenses, subscriptions, setSubscriptions, goals, setGoals, customCategories, setCustomCategories, income, setIncome, updateIncome, balance, setBalance, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
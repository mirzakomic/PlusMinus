import { useNavigate } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [shouldRefetch, _refetch] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      try {
        const { data } = await axiosInstance.get('/user/secure');
        setUser(data);
        console.log('User data fetched:', data);
        setIsLoggedIn(true);
        console.log(isLoggedIn, "user eingeloggt?");
      } catch (error) {
        setUser(null);
        console.log('Error fetching user data:', error);
        setIsLoggedIn(false);
      }
    };
    fetchUserData();
  }, [shouldRefetch]);

  return (
    <UserContext.Provider value={{ user, isLoggedIn, refetch, logout }}>
      {children}
    </UserContext.Provider>
  );
};
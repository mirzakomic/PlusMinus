import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const location = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    console.log('Verification token:', token);

    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/user/verify-email?token=${token}`);
        setMessage(response.data.message);
        setTimeout(() => {
            nav('/login')
        }, 4000)
      } catch (error) {
        setMessage(error.response.data.error || 'An error occurred');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setMessage('Invalid token');
    }
  }, [location]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}. You will now be redirected to the login page.</p>
    </div>
  );
};

export default VerifyEmail;
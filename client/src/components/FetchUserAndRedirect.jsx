import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/authSlice';

function FetchUserAndRedirect({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/login/success', {
          credentials: 'include', // Include cookies for session
        });
        const data = await response.json();
        if (data.success) {
          dispatch(setUser(data.user)); // Store user details in Redux
          //navigate('/experiences'); // Redirect to experiences after login
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUser();
  }, [dispatch, navigate]);

  return <>{children}</>;
}

export default FetchUserAndRedirect;
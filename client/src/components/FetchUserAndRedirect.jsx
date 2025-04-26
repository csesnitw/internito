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
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/login/success`,
          {
            credentials: 'include',
          }
        );
        const data = await response.json();
        if (data.success) {
          dispatch(setUser(data.user));
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
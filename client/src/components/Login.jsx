import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, setUser } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle Google login redirect
  const handleLogin = () => {
    const redirectUri = 'http://localhost:8000/auth/google';
    window.location.href = redirectUri; // Redirect to Google login
  };

  // Fetch user details after redirect from Google login
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/login/success', {
          credentials: 'include', // Include cookies for session
        });
        const data = await response.json();
        if (data.success) {
          dispatch(login()); // Set login state
          dispatch(setUser(data.user)); // Store user details in Redux
          navigate('/experiences'); // Navigate to experiences
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

export default Login;
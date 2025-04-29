import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, setUser } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Add styles for the Login page

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle Google login redirect
  const handleLogin = () => {
    const redirectUri = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/google`;
    window.location.href = redirectUri; // Redirect to Google login
  };

  // Fetch user details after redirect from Google login
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/login/success`,
          {
            credentials: 'include', // Include cookies for session
          }
        );
        const data = await response.json();
        if (data.success) {
          dispatch(login()); // Set login state
          dispatch(setUser(data.user)); // Store user details in Redux
          navigate('/search'); // Navigate to experiences
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login to Your Account</h1>
        <button className="google-login-btn" onClick={handleLogin}>
          Login with Google
        </button>
        <p>
          *Use your NITW student email only.
        </p>
      </div>
    </div>
  );
}

export default Login;
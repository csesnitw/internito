import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

function Experiences() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Get user details from Redux

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/logout', {
        method: 'GET',
        credentials: 'include', // Include cookies for session
      });
      dispatch(logout()); // Clear Redux state
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <h1>Experiences Page</h1>
      {user && <h2>Hello, {user.username}</h2>} {/* Display username */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Experiences;
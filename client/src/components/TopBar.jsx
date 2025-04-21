import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import './TopBar.css'; // Add styles for the TopBar

function TopBar() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Check login status
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <header className="topbar">
      <div className="logo">
        <h1>interNito</h1>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/about">About</Link>
          </li>
          {!isLoggedIn ? (
            // Show Login and Register if not logged in
            <>
              <li>
                <Link to="/">Log In</Link>
              </li>
            </>
          ) : (
            // Show other links if logged in
            <>
              <li>
                <Link to="/search">Search Companies</Link>
              </li>
              <li>
                <Link to="/experiences">Experiences</Link>
              </li>
              <li>
                <Link to="/addExperiences">Write</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default TopBar;
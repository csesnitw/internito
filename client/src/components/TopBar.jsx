import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { logout } from '../slices/authSlice';
import './TopBar.css'; // Add styles for the TopBar

function TopBar() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Check login status
  const user = useSelector((state) => state.auth.user); // Get user details from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('User details:', user);
  }, [user]);

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
        <h1>inter<span className="logo-n">N</span>ito</h1>
      </div>
      <nav>
        <ul className="nav-links">
          {!isLoggedIn ? (
            // Show Login and Register if not logged in
            <>
              <li>
                <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Log In
                </NavLink>
              </li>
            </>
          ) : (
            // Show other links if logged in
            <>
              <li>              
                <span>
                  {user && user.firstName ? (
                    <>
                      Hello, <strong>{user.firstName}</strong>!
                    </>
                  ) : (
                    'Loading...'
                  )}
                </span>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/search" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Search Companies
                </NavLink>
              </li>
              <li>
                <NavLink to="/experiences" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Experiences
                </NavLink>
              </li>
              <li>
                <NavLink to="/addExperiences" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Write
                </NavLink>
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
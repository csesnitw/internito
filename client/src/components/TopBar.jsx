import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import './TopBar.css'; 

function TopBar() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [menuOpen, setMenuOpen] = useState(false); // <-- new state for mobile menu

  useEffect(() => {
    console.log('User details:', user);
  }, [user]);

  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/logout`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="topbar">
      <div className="logo">
        <h1>inter<span className="logo-n">N</span>ito</h1>
      </div>

      {/* Hamburger icon */}
      <div className="hamburger" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <ul>
          {!isLoggedIn ? (
            <>
              <li>
                <NavLink to="/about" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
                  Log In
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <span>
                  {user && user.firstName ? (
                    <>
                      Hello <strong>{user.firstName}</strong>!
                    </>
                  ) : (
                    'Loading...'
                  )}
                </span>
              </li>
              <li>
                <NavLink to="/search" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
                  Search Companies
                </NavLink>
              </li>
              <li>
                <NavLink to="/experiences" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
                  Experiences
                </NavLink>
              </li>
              <li>
                <NavLink to="/addExperiences" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
                  Write
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
                  About
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-button">
                  Log Out
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

import React from 'react';
import { Link } from 'react-router-dom';
import './TopBar.css'; // Add styles for the TopBar

function TopBar() {
  return (
    <header className="topbar">
      <div className="logo">
        <h1>interNito</h1>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/search">Search Companies</Link>
          </li>
          <li>
            <Link to="/experiences">Experiences</Link>
          </li>
          <li>
            <Link to="/write">Write</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/">Log In</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default TopBar;
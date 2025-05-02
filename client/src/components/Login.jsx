import React from 'react';
import './Login.css';

function Login() {
  // Function to handle Google login redirect
  const handleLogin = () => {
    const redirectUri = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/google`;
    window.location.href = redirectUri;
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>
          Login to <span style={{ color: "#76B852" }}>interNito</span>
        </h1>
        <button className="google-login-btn" onClick={handleLogin}>
          Login with Google
        </button>
        <div className="login-note">
          <span className="login-note-icon">!</span>
          <span>
            Use your <span className="login-note-green">NITW student email</span> only.
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
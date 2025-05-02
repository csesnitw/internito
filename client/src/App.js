import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadSession } from './slices/authSlice';
import TopBar from './components/TopBar';
import Login from './components/Login';
import Experiences from './components/Experiences';
import ProtectedRoute from './components/ProtectedRoute';
import FetchUserAndRedirect from './components/FetchUserAndRedirect';
import AddExperience from './components/AddExperience';
import SearchResults from './components/SearchResults'; // Import the SearchResults component
import SearchPage from './components/SearchPage'; // Import the SearchPage component
import About from './components/About'; // Import the About component
import './App.css'; // Import your CSS file
import AdminDashboard from './components/AdminDashboard';
import Feedback from './components/Feedback';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <div className="topbar-fixed">
          <TopBar />
        </div>
        <div className="content-wrapper">
          <div className="content">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <FetchUserAndRedirect>
                    <AdminDashboard />
                  </FetchUserAndRedirect>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <FetchUserAndRedirect>
                      <SearchPage />
                    </FetchUserAndRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/experiences"
                element={
                  <ProtectedRoute>
                    <FetchUserAndRedirect>
                      <Experiences />
                    </FetchUserAndRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feedback"
                element={
                  <ProtectedRoute>
                    <FetchUserAndRedirect>
                      <Feedback />
                    </FetchUserAndRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/addExperiences"
                element={
                  <ProtectedRoute>
                    <FetchUserAndRedirect>
                      <AddExperience />
                    </FetchUserAndRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search/:query"
                element={
                  <ProtectedRoute>
                    <FetchUserAndRedirect>
                      <SearchResults />
                    </FetchUserAndRedirect>
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
          <footer>
            <div className="footer-copyright">
              Copyright © 2025 interNito
            </div>
            <div className="footer-madeby">
              Made with <span className="footer-heart">❤</span> by Sufiyan, Chaitanya, Chirantan, Divya &amp; Abhishek
            </div>
            <div className="footer-madeby">
              Rebuilt by CSES Development Team, NIT Warangal
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}


export default App;
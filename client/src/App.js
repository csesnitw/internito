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
import SearchResults from './components/SearchResults';
import SearchPage from './components/SearchPage';
import About from './components/About';
import './App.css';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDasboard';
import Feedback from './components/Feedback';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <div className="topbar-fixed">
          <TopBar />
        </div>
        <div className="content-wrapper">
          <div className="content">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                element={<FetchUserAndRedirect />}
              >
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/user" element={<UserDashboard />}/>
                <Route path="/search" element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                } />
                <Route path="/experiences" element={
                  <ProtectedRoute>
                    <Experiences />
                  </ProtectedRoute>
                } />
                <Route path="/feedback" element={
                  <ProtectedRoute>
                    <Feedback />
                  </ProtectedRoute>
                } />
                <Route path="/addExperiences" element={
                  <ProtectedRoute>
                    <AddExperience />
                  </ProtectedRoute>
                } />
                <Route path="/search/:query" element={
                  <ProtectedRoute>
                    <SearchResults />
                  </ProtectedRoute>
                } />
                <Route path="/about" element={<About />} />
              </Route>
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
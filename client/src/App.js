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
import SearchPage from './components/SearchPage'; // Import the SearchPage component
import About from './components/About'; // Import the About component
import './App.css'; // Import your CSS file

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <TopBar /> {/* TopBar is always visible */}
        <div className="content"> {/* Dynamic content below TopBar */}
          <Routes>
            <Route path="/" element={<Login />} />
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
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} /> {/* Add About route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
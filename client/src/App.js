import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadSession, setUser } from './slices/authSlice';
import Login from './components/Login';
import Experiences from './components/Experiences';
import ProtectedRoute from './components/ProtectedRoute';
import FetchUserAndRedirect from './components/FetchUserAndRedirect';
import AddExperience from './components/AddExperience';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Login</Link>
            </li>
            <li>
              <Link to="/experiences">Experiences</Link>
            </li>
            <li>
              <Link to="/AddExperiences">Add Experience</Link>
            </li>
          </ul>
        </nav>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
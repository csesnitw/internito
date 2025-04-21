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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
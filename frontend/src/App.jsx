import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Registration from "./pages/Registrarion";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]); // triggered on route change

  // Function to handle login action
  const handleLogin = (formData) => {
    // Logic to handle login action goes here
    console.log('Login data:', formData);
    // Redirect to Dashboard after successful login
    // You can use history object to navigate programmatically
  };

  // Function to handle registration action
  const handleRegistration = (formData) => {
    // Logic to handle registration action goes here
    console.log('Registration data:', formData);
    // Redirect to Dashboard after successful registration
    // You can use history object to navigate programmatically
  };

  return (
      <Routes>
        <Route path="/" element={<Dashboard />} >
          <Route path="profile" element={<Profile />} />
          {/*
          <Route
              path="login"
              element={<Login onLogin={handleLogin} />}
          />
          <Route
              path="register"
              element={<Registration onRegister={handleRegistration} />}
          />*/}

        </Route>
      </Routes>
  );
}

export default App;

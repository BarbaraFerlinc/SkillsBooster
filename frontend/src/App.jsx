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
import Registration from "./pages/Registration";

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/register" element={<Registration />} />
        <Route exact path="/login" element={<Login />} />

        <Route exact path="/profile" element={<Profile />} />


      </Routes>
    </>
  );
}

export default App;

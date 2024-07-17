import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './css/style.css';
import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Profile from "./pages/Profil/Profile.jsx";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Domena from "./pages/Domene/Domena";
import DodajDomeno from "./pages/Domene/DodajDomeno";
import LogOut from "./pages/LogOut.jsx";
import Kviz from "./pages/Kviz/Kviz.jsx";
import DodajKviz from "./pages/Kviz/DodajKviz.jsx";
import { AuthContextProvider } from './context/AuthContext.jsx';
import PrivateRouting from './components/PrivateRouting.jsx';
import BossRouting from './components/BossRouting.jsx';
import UserRouting from './components/UserRouting.jsx';
import AdminRouting from './components/AdminRouting.jsx';
import SolveQuiz from "./pages/Kviz/SolveQuiz.jsx";

function App() {
  return (
      <AuthContextProvider>
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="/register" element={<Registration />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/logout" element={<LogOut />} />

          <Route element={<PrivateRouting />}>
            <Route path="/profile" element={<Profile />} />
            <Route exact path="/domena/:id" element={<Domena />} />

            <Route element={<BossRouting />}>
              <Route exact path="/addQuiz/:domain" element={<DodajKviz />} />
            </Route>

            <Route element={<UserRouting />}>
              <Route exact path="/quiz/:id" element={<Kviz />} />
              <Route exact path="/solveQuiz/:id" element={<SolveQuiz />} />
            </Route>
          </Route>

          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </AuthContextProvider>
  );
}

export default App;

import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';

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
import OpenQuestions from "./pages/Kviz/OpenQuestions.jsx";
import ClosedQuestions from "./pages/Kviz/ClosedQuestions.jsx";
import { AuthContextProvider } from './context/AuthContext.jsx';
import PrivateRouting from './components/PrivateRouting.jsx';
import BossRouting from './components/BossRouting.jsx';
import AdminRouting from './components/AdminRouting.jsx';
import SolveQuiz from "./pages/Kviz/SolveQuiz.jsx";


function App() {

  /*const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change*/

  return (<>
      <AuthContextProvider>
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="/register" element={<Registration />} />
          <Route exact path="/login" element={<Login />} />          

          <Route path='' element={<PrivateRouting />}>
            <Route path="/profile" element={<Profile />} />
            <Route exact path="/domena/:id" element={<Domena/>} />
            <Route exact path="/logout" element={<LogOut/>} />
            <Route exact path="/quiz/:id" element={<Kviz/>} />

            <Route path='' element={<BossRouting />}>
              <Route exact path="/addDomena" element={<DodajDomeno/>} />
              <Route exact path="/addQuiz" element={<DodajKviz/>} />
            </Route>
          </Route>
          
          {/*  <Route exact path="/open" element={<OpenQuestions/>} />
          <Route exact path="/closed" element={<ClosedQuestions/>} />*/}

          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;

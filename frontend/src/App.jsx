import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';

import './css/style.css';



// Import pages
import Dashboard from './pages/Dashboard';
import Profile from "./pages/Profil/Profile.jsx";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Domain from "./pages/Domain/Domain.jsx";
import LogOut from "./pages/LogOut.jsx";
import Quiz from "./pages/Quiz/Quiz.jsx";
import AddQuiz from "./pages/Quiz/AddQuiz.jsx";
import { AuthContextProvider } from './context/AuthContext.jsx';
import PrivateRouting from './components/PrivateRouting.jsx';
import BossRouting from './components/BossRouting.jsx';
import UserRouting from './components/UserRouting.jsx';
import SolveQuiz from "./pages/Quiz/SolveQuiz.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

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
          <Route exact path="/reset" element={<ResetPassword />} />

          <Route path='' element={<PrivateRouting />}>
            <Route path="/profile" element={<Profile />} />
            <Route exact path="/domain/:id" element={<Domain/>} />
            <Route exact path="/logout" element={<LogOut/>} />

            <Route path='' element={<BossRouting />}>
              <Route exact path="/addQuiz/:domain" element={<AddQuiz/>} />
            </Route>

            <Route path='' element={<UserRouting />}>
              <Route exact path="/quiz/:id/:domain" element={<Quiz/>} />
              <Route exact path="/solveQuiz/:id/:domain" element={<SolveQuiz/>} />
            </Route>
          </Route>

          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;

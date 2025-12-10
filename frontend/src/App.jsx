import React from 'react';
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import './css/style.css';

import Dashboard from './pages/Dashboard';
import Profile from "./pages/Profil/Profile.jsx";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Domain from "./pages/Domain/Domain.jsx";
import LogOut from "./pages/LogOut.jsx";
import Quiz from "./pages/Quiz/Quiz.jsx";
import AddQuiz from "./pages/Quiz/AddQuiz.jsx";
import AddQuiz2 from "./pages/Quiz/AddQuiz2.jsx";
import { AuthContextProvider } from './context/AuthContext.jsx';
import PrivateRouting from './components/PrivateRouting.jsx';
import ManagerRouting from './components/ManagerRouting.jsx';
import EmployeeRouting from './components/EmployeeRouting.jsx';
import Routing from './components/Routing.jsx';
import SolveQuiz from "./pages/Quiz/SolveQuiz.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import SessionManager from './utils/SessionManager.jsx';

function App() {
  return (
    <AuthContextProvider>
      <SessionManager>
        <Routes>
          <Route path='' element={<Routing />}>
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/register" element={<Registration />} />
            <Route exact path="/login" element={<Login />} />
          </Route>

          <Route exact path="/reset" element={<ResetPassword />} />

          <Route path='' element={<PrivateRouting />}>
            <Route path="/profile" element={<Profile />} />
            <Route exact path="/domain/:id" element={<Domain/>} />


            <Route exact path="/logout" element={<LogOut/>} />

            <Route path='' element={<ManagerRouting />}>
              <Route exact path="/addQuiz/:domain" element={<AddQuiz/>} />
              <Route exact path="/addQuiz2/:domain" element={<AddQuiz2/>} />
            </Route>

            <Route path='' element={<EmployeeRouting />}>
              <Route exact path="/quiz/:id/:domain" element={<Quiz/>} />
              <Route exact path="/solveQuiz/:id/:domain" element={<SolveQuiz/>} />
            </Route>
          </Route>

          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </SessionManager>
    </AuthContextProvider>
  );
}

export default App;

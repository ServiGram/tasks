import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard/dashboard';
import PrivateRoute from './services/PrivateRoute';
import Perfil from './pages/Profile/perfil';
import Tasks from './pages/Tasks/tasks';

const App: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} redirectPath='/' />}>
          <Route path="/dashboard" element={<Dashboard />}>
            {/* Subrutas dinámicas */}
            <Route path="profile" element={<Perfil />} />
            <Route path="tasks" element={<Tasks />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const MainApp = () => (
  <Router>
    <App />
  </Router>
);

export default MainApp;


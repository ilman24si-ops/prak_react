import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute component={Dashboard} />} />
        <Route path="/admin" element={<ProtectedRoute component={Admin} />} />
      </Routes>
    </Router>
  );
};

export default App;
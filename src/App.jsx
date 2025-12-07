import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Invoices from './pages/Invoices';
import Users from './pages/Users';
import SupportTickets from './pages/SupportTickets';
import Appointments from './pages/Appointments';
import QuickQuotes from './pages/QuickQuotes';
import Career from './pages/Career';
import Notifications from './pages/Notifications';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/Login';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="users" element={<Users />} />
            <Route path="tickets" element={<SupportTickets />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="quotes" element={<QuickQuotes />} />
            <Route path="career" element={<Career />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

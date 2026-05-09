import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Users from './pages/Admin/Users';

// Simple Unauthorized page
const Unauthorized = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ color: 'var(--danger)' }}>Unauthorized Access</h1>
    <p>You do not have permission to view this page.</p>
    <button className="btn btn-primary" onClick={() => window.history.back()} style={{ marginTop: '1rem' }}>Go Back</button>
  </div>
);

// Generic Placeholder for other pages
const Placeholder = ({ title }) => (
  <div className="card">
    <h2>{title}</h2>
    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
      This page is part of the Asset Management module (Person B's scope).
    </p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}><OutletProxy /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/allocations" element={<Placeholder title="Asset Allocations" />} />
              <Route path="/reports" element={<Placeholder title="Reports & Analytics" />} />
            </Route>

            <Route path="/assets" element={<Placeholder title="Asset Inventory" />} />
            <Route path="/settings" element={<Placeholder title="User Settings" />} />

            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><OutletProxy /></ProtectedRoute>}>
              <Route path="/users" element={<Users />} />
              <Route path="/sync" element={<Placeholder title="Inventory Sync" />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Helper to allow nested protected routes with Outlet
import { Outlet } from 'react-router-dom';
const OutletProxy = () => <Outlet />;

export default App;

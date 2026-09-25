// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './hooks/useAuth';
import ProtectedRoute from './layouts/ProtectedRoute'; // Fixed import
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Savings from './pages/Savings';
import Loans from './pages/Loans';
import Finance from './pages/Finance';
import Welfare from './pages/Welfare';
import Settings from './pages/Settings';
import Meetings from './pages/Meetings';
import Dividends from './pages/Dividends';
import { Loader2 } from 'lucide-react';

// A wrapper for public routes (like Login)
// If user is logged in, redirect them to the dashboard
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-slate-600 font-medium">Loading Chama Sacco...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />; // User is logged in, send to dashboard
  }

  return children; // User is NOT logged in, show Login page
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route (Only accessible if logged OUT) */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes (Only accessible if logged IN) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />

              <Route path="/meetings" element={<Meetings />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/welfare" element={<Welfare />} />
              <Route path="/dividends" element={<Dividends />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Fallback route for unknown URLs */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
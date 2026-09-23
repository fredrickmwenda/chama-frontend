// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth'; // Fixed import
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-600">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-600" />
        <p className="text-lg font-medium">Authenticating...</p>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
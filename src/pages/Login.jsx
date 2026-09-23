// src/pages/Login.jsx
import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuth'; 
import { useNavigate } from 'react-router-dom';
import { HandCoins, User, Lock, Loader2, ShieldCheck } from 'lucide-react';

const Login = () => {
  // Changed from 'username' to 'loginIdentifier' since it accepts email too
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthContext(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Prevent double submissions
    
    try {
      // We pass the identifier (email or username) to the login function.
      // The backend serializer will handle checking if it contains '@' 
      // and route the authentication accordingly.
      await login(loginIdentifier, password);
      navigate('/');
    } catch (err) {
      // Check if backend sent a specific error message
      const backendError = err.response?.data?.detail || err.response?.data?.error;
      setError(backendError || 'Invalid credentials. Please check your username/email and password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      
      {/* --- Left Panel: Branding & Visuals (Hidden on mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo / Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 backdrop-blur rounded-xl">
              <HandCoins className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide">Chama Sacco</h1>
          </div>
          
          {/* Main Message */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Empowering our community, one contribution at a time.
            </h2>
            <p className="text-indigo-100 text-lg max-w-md">
              Securely manage your savings, track loans, and support welfare initiatives all in one place.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-indigo-100">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-100">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Member Transparent</span>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <p className="text-indigo-200 text-sm">© {new Date().getFullYear()} Chama Sacco. All rights reserved.</p>
        </div>
      </div>

      {/* --- Right Panel: Login Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo (Shows only on small screens) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <HandCoins className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Chama Sacco</h1>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Please sign in to your account to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username OR Email Input */}
            <div>
              <label className="label">Username or Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={loginIdentifier} 
                  onChange={e => setLoginIdentifier(e.target.value)} 
                  className="input pl-10" 
                  placeholder="e.g. john_doe or john@email.com" 
                  autoFocus
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="input pl-10" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary w-full justify-center" 
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
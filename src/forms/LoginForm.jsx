import { useState, useContext } from 'react';
import { AuthContext } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-slate-200">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-indigo-600">Chama System</h2>
          <p className="mt-2 text-center text-sm text-slate-500">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="input" placeholder="johndoe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" />
          </div>
          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">{error}</p>}
          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
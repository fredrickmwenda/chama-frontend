// src/layouts/MainLayout.jsx
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth';
// <-- Added Users and Coins to the imports below
import { LayoutDashboard, CalendarPlus, HandCoins, Settings as SettingsIcon, LogOut, HeartPulse, TrendingDown, Users, Coins } from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['Super Admin', 'Admin User', 'Secretary', 'Finance Manager', 'Member'] },
    { path: '/savings', label: 'Savings & Meetings', icon: <CalendarPlus className="w-5 h-5" />, roles: ['Super Admin', 'Admin User', 'Secretary'] },
    { path: '/loans', label: 'Loans Management', icon: <HandCoins className="w-5 h-5" />, roles: ['Super Admin', 'Admin User', 'Finance Manager'] },
    { path: '/finance', label: 'Finance & Expenses', icon: <TrendingDown className="w-5 h-5" />, roles: ['Super Admin', 'Admin User', 'Finance Manager'] },
    { path: '/welfare', label: 'Welfare Fund', icon: <HeartPulse className="w-5 h-5" />, roles: ['Super Admin', 'Admin User', 'Secretary', 'Finance Manager', 'Member'] },
    { path: '/members', label: 'Members', icon: <Users className="w-5 h-5" />, roles: ['Super Admin', 'Admin User', 'Secretary', 'Finance Manager'] },
    { path: '/dividends', label: 'Dividends', icon: <Coins className="w-5 h-5" />, roles: ['Super Admin', 'Admin User', 'Finance Manager'] }, 
    { path: '/settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" />, roles: ['Super Admin', 'Admin User'] },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col fixed h-full">
        <h1 className="text-xl font-bold text-indigo-600 mb-8 px-4">Chama Sacco</h1>
        <nav className="space-y-1 flex-1">
          {navItems.filter(item => user && item.roles.includes(user.role)).map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'nav-item-active' : ''}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t pt-4 mt-4 px-4">
          <p className="text-sm font-semibold text-slate-800">{user?.username}</p>
          <p className="text-xs text-slate-500 mb-3">{user?.role}</p>
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 ml-64 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
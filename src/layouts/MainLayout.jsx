// src/layouts/MainLayout.jsx
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth';
import { 
  LayoutDashboard, CalendarPlus, HandCoins, Settings as SettingsIcon, 
  LogOut, HeartPulse, TrendingDown, Users, Coins, Sparkles, 
  Search, Bell, PlusCircle, CalendarDays,Wallet // <-- Added Header Icons
} from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'Admin User', 'Secretary', 'Finance Manager', 'Member'] },
    { path: '/savings', label: 'Savings & Meetings', icon: CalendarPlus, roles: ['Super Admin', 'Admin User', 'Secretary'] },
    { path: '/loans', label: 'Loans Management', icon: HandCoins, roles: ['Super Admin', 'Admin User', 'Finance Manager'] },
    { path: '/finance', label: 'Finance & Expenses', icon: TrendingDown, roles: ['Super Admin', 'Admin User', 'Finance Manager'] },
    { path: '/welfare', label: 'Welfare Fund', icon: HeartPulse, roles: ['Super Admin', 'Admin User', 'Secretary', 'Finance Manager', 'Member'] },
    { path: '/members', label: 'Members', icon: Users, roles: ['Super Admin', 'Admin User', 'Secretary', 'Finance Manager'] },
    { path: '/dividends', label: 'Dividends', icon: Coins, roles: ['Super Admin', 'Admin User', 'Finance Manager'] }, 
    // Inside MainLayout.jsx navItems
    { path: '/meetings', label: 'Meetings', icon: CalendarDays, roles: ['Super Admin', 'Admin User', 'Secretary'] },
    { path: '/savings', label: 'Savings', icon: Wallet, roles: ['Super Admin', 'Admin User', 'Secretary', 'Finance Manager'] },
  ];

  // Find the current page title based on the URL
  const currentPath = location.pathname;
  const activeNav = navItems.find(item => item.path === currentPath);
  const pageTitle = activeNav ? activeNav.label : 'Dashboard';
  
  const userInitial = user?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      
      {/* --- Premium Sidebar --- */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col fixed h-screen z-30">
        
        {/* Logo Header */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">Chama Sacco</h1>
            <p className="text-xs text-slate-400 mt-1">Member Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Main Menu
          </p>
          {navItems
            .filter(item => user && item.roles.includes(user.role))
            .map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                {userInitial}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">{user?.username}</p>
                <p className="text-xs text-slate-500 truncate">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={() => { logout(); navigate('/login'); }} 
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white hover:bg-red-50 rounded-lg transition-colors border border-slate-200 hover:border-red-200 active:scale-95"
            >
              <LogOut className="w-4 h-4" /> 
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        
        {/* --- Top Header --- */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center px-8 justify-between">
          
          {/* Left: Dynamic Page Title */}
          <div className="hidden md:block">
            <h2 className="text-xl font-bold text-slate-800">{pageTitle}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Center: Search Bar */}
          <div className="relative flex-1 max-w-md mx-8 hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search members, loans, transactions..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-xl text-sm focus:bg-white focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            />
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-3 ml-auto">
            <button className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors relative">
              <Bell className="w-5 h-5 text-slate-600" />
              {/* Notification Dot */}
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-slate-100"></span>
            </button>
            
            <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20 active:scale-95">
              <PlusCircle className="w-4 h-4" />
              Quick Add
            </button>
          </div>

        </header>

        {/* --- Page Content --- */}
        <div className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuth';
import api from '../api/api';// FIX: Using your configured api instance to send the JWT token!
import { Wallet, TrendingDown, HandCoins, Users, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    // Fetch dashboard stats using the authenticated api instance
    api.get('/dashboard/')
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to fetch dashboard stats:', err))
      .finally(() => setIsLoading(false));
  }, []);

  // Loading State
  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  const cards = [
    { title: 'Total Members', value: stats?.total_members || 0, icon: <Users className="w-7 h-7 text-blue-600" />, color: 'bg-blue-50', border: 'border-blue-100' },
    { title: 'Total Savings', value: `KES ${(stats?.total_contributions || 0).toLocaleString()}`, icon: <Wallet className="w-7 h-7 text-emerald-600" />, color: 'bg-emerald-50', border: 'border-emerald-100' },
    { title: 'Total Expenses', value: `KES ${(stats?.total_expenses || 0).toLocaleString()}`, icon: <TrendingDown className="w-7 h-7 text-red-600" />, color: 'bg-red-50', border: 'border-red-100' },
    { title: 'Active Loans', value: `KES ${(stats?.total_loans || 0).toLocaleString()}`, icon: <HandCoins className="w-7 h-7 text-amber-600" />, color: 'bg-amber-50', border: 'border-amber-100' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user.username}! 👋</h1>
        <p className="text-slate-500 mt-1">Here is what's happening in your Chama today.</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div key={index} className={`card flex items-center justify-between !p-5 ${card.border}`}>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{card.title}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.color}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Financial Trends</h2>
          <p className="text-sm text-slate-500">Monthly contribution performance.</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.contribution_chart_data || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '0.75rem', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }} 
                formatter={(value) => [`KES ${value.toLocaleString()}`, 'Amount']} 
              />
              <Bar dataKey="amount" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
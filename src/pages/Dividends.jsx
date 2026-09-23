// src/pages/Dividends.jsx
import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatters';
import { Coins, PlusCircle, Loader2, Info, CheckCircle2, Clock, CalendarDays, CalendarClock } from 'lucide-react';

const Dividends = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();
  
  // State for the active rule (can be toggled by Admin)
  // 'YEARLY' = Entire year contributions. 'CUTOFF' = Up to the first business month.
  const [activeRule, setActiveRule] = useState('YEARLY');

  const canManage = user && ['Super Admin', 'Admin User', 'Finance Manager'].includes(user.role);

  // Mock data simulating backend response
  // Notice we now have 'total_contribution' and 'qualifying_contribution'
  const mockDistribution = [
    { id: 1, name: 'John Doe', total_contribution: 120000, qualifying_contribution: 120000, share: 40, dividend: 20000, status: 'Approved' },
    { id: 2, name: 'Jane Smith', total_contribution: 90000, qualifying_contribution: 75000, share: 25, dividend: 12500, status: 'Pending' },
    { id: 3, name: 'Mike Ross', total_contribution: 60000, qualifying_contribution: 45000, share: 15, dividend: 7500, status: 'Pending' },
    { id: 4, name: 'Sarah Jones', total_contribution: 30000, qualifying_contribution: 60000, share: 20, dividend: 10000, status: 'Approved' },
  ];

  const [dividends, setDividends] = useState(null);

  useEffect(() => {
    // Simulate fetching data based on the active rule
    setIsLoading(true);
    setTimeout(() => {
      setDividends({
        total_pool: 50000,
        approved_total: 30000,
        paid_out: 0,
        pending_approval: 20000,
        distribution: mockDistribution
      });
      setIsLoading(false);
    }, 1000);
  }, [activeRule]); // Refetch whenever the rule changes

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-600" />
        <p>Calculating dividend data...</p>
      </div>
    );
  }

  // Dynamic descriptions based on the active rule
  const allocationDesc = activeRule === 'YEARLY' 
    ? 'Dividends are calculated based on the total contributions made by the member throughout the entire financial year.'
    : 'Dividends are calculated based ONLY on contributions made on or before the first business month of the government calendar.';

  const terms = [
    { title: 'Eligibility', desc: 'Only registered members aged 18+ who have made at least one contribution participate.' },
    { title: 'Allocation', desc: allocationDesc }, // <-- Dynamic logic here
    { title: 'Period', desc: 'Calculations follow the standard financial calendar (Jan 1st to Dec 31st).' },
    { title: 'Deductions', desc: 'Outstanding fines or defaulted loans are deducted from the final payout.' },
    { title: 'Approval', desc: 'All payouts must be reviewed and marked as paid by the Finance Committee.' },
  ];

  const stats = [
    { title: 'Total Dividend Pool', value: formatCurrency(dividends.total_pool), icon: <Coins className="w-6 h-6 text-indigo-600" />, color: 'bg-indigo-50' },
    { title: 'Approved Total', value: formatCurrency(dividends.approved_total), icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />, color: 'bg-emerald-50' },
    { title: 'Pending Approval', value: formatCurrency(dividends.pending_approval), icon: <Clock className="w-6 h-6 text-amber-600" />, color: 'bg-amber-50' },
    { title: 'Paid Out', value: formatCurrency(dividends.paid_out), icon: <Coins className="w-6 h-6 text-slate-600" />, color: 'bg-slate-100' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Coins className="w-8 h-8 text-indigo-600" /> Dividends
          </h1>
          <p className="text-slate-500 mt-1">End-of-year payouts derived from member contribution ratios.</p>
        </div>
        {canManage && (
          <button className="btn-primary">
            <PlusCircle className="w-4 h-4" />
            New Payout
          </button>
        )}
      </div>

      {/* Rule Switcher (Admin Only) */}
      {canManage && (
        <div className="card mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 !py-4">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-slate-500" />
            <div>
              <p className="font-semibold text-slate-800">Calculation Rule</p>
              <p className="text-sm text-slate-500">Select the period used to derive qualifying contributions.</p>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveRule('YEARLY')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeRule === 'YEARLY' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              <CalendarDays className="w-4 h-4" /> Full Year Base
            </button>
            <button 
              onClick={() => setActiveRule('CUTOFF')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeRule === 'CUTOFF' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              <CalendarClock className="w-4 h-4" /> Cutoff Month Base
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card flex items-center justify-between !p-5">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Payout Terms */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <Info className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-slate-800">Payout Terms</h2>
            </div>
            <div className="space-y-5">
              {terms.map((term, index) => (
                <div key={index}>
                  <h4 className="text-sm font-bold text-slate-800">{term.title}</h4>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{term.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distribution Table */}
        <div className="lg:col-span-2">
          <div className="table-container h-full">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-slate-500" />
              <h2 className="text-xl font-semibold text-slate-800">Member Distribution Breakdown</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Qualifying Amount</th>
                    <th>Share %</th>
                    <th>Dividend</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dividends.distribution.map((row) => (
                    <tr key={row.id}>
                      <td className="font-medium text-slate-900">
                        {row.name}
                        {/* Show total contribution as a tooltip/subtext if it differs from qualifying */}
                        {activeRule === 'CUTOFF' && row.total_contribution !== row.qualifying_contribution && (
                          <span className="block text-xs font-normal text-slate-400">(Total: {formatCurrency(row.total_contribution)})</span>
                        )}
                      </td>
                      <td className="text-slate-700 font-medium">{formatCurrency(row.qualifying_contribution)}</td>
                      <td>
                        <span className="badge-info">{row.share}%</span>
                      </td>
                      <td className="font-bold text-emerald-600">{formatCurrency(row.dividend)}</td>
                      <td>
                        {row.status === 'Approved' ? (
                          <span className="badge-success">Approved</span>
                        ) : (
                          <span className="badge-warning">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dividends;
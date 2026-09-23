// src/pages/Savings.jsx
import { useEffect, useState } from 'react';
import api from '../api/api'; // Fixed path: '../api' instead of '../api/api'
import { useAuthContext } from '../hooks/useAuth'; // For role checking
import { formatCurrency, formatDate } from '../utils/formatters';
import { CalendarPlus, PlusCircle, Loader2, Wallet, CalendarDays } from 'lucide-react';

const Savings = () => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext(); // Get current user

  useEffect(() => {
    // Fetch meetings and handle loading/errors properly
    api.get('/savings/meetings/')
      .then(res => setMeetings(res.data))
      .catch(err => console.error('Failed to fetch meetings:', err))
      .finally(() => setIsLoading(false));
  }, []);

  // Only Secretaries and Admins can manage meetings/savings
  const canManage = user && ['Super Admin', 'Admin User', 'Secretary'].includes(user.role);

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Savings & Meetings</h1>
          <p className="text-slate-500 mt-1">Track upcoming meetings and record member contributions.</p>
        </div>
        {canManage && (
          <button className="btn-primary">
            <PlusCircle className="w-4 h-4" />
            Schedule Meeting
          </button>
        )}
      </div>

      {/* Content Card */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <CalendarDays className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-slate-800">Upcoming Meetings</h2>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-600" />
            <p>Loading meetings...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meetings.map(meet => (
              <div 
                key={meet.id} 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-200 transition-all group"
              >
                {/* Meeting Info */}
                <div className="flex items-center gap-4 mb-3 md:mb-0">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <CalendarPlus className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{meet.title}</p>
                    <p className="text-sm text-slate-500">{formatDate(meet.date)}</p>
                  </div>
                </div>

                {/* Actions & Badges */}
                <div className="flex items-center gap-4 justify-between md:justify-end">
                  <span className="badge-info flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5" />
                    Min: {formatCurrency(meet.minimum_contribution)}
                  </span>
                  
                  {canManage ? (
                    <button className="btn-ghost text-sm">
                      Record Savings
                    </button>
                  ) : (
                    <button className="btn-success text-sm">
                      Contribute Now
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Empty State */}
            {!isLoading && meetings.length === 0 && (
              <div className="text-center py-12 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No meetings scheduled.</p>
                {canManage && <p className="text-slate-400 text-sm mt-1">Click "Schedule Meeting" to create one.</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Savings;
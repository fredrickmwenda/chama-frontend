// src/pages/Savings.jsx
import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuth';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import { Wallet, PlusCircle, Loader2, X, Save } from 'lucide-react';

const Savings = () => {
  const { user } = useAuthContext();
  const [isSavingModalOpen, setIsSavingModalOpen] = useState(false);
  const [isLoading] = useState(false); // Set to true when fetching from API

  const canManage = user && ['Super Admin', 'Admin User', 'Secretary', 'Finance Manager'].includes(user.role);
  const today = new Date().toISOString().split('T')[0];

  // Mock data for the table
  const contributions = [
    { id: 1, member: 'John Doe', amount: 500, date: '2023-10-01', method: 'Cash', meeting: 'October Meetup' },
    { id: 2, member: 'Jane Smith', amount: 1000, date: '2023-10-01', method: 'M-Pesa', meeting: 'October Meetup' },
    { id: 3, member: 'Mike Ross', amount: 500, date: '2023-10-01', method: 'Cash', meeting: 'October Meetup' },
  ];

  const handleRecordSaving = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const savingDate = new Date(formData.get('date'));
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (savingDate < todayDate) {
      return toast.error("You cannot record a saving on a past date.");
    }

    try {
      // await api.post('/savings/record/', { ...data });
      toast.success("Saving recorded successfully!");
      setIsSavingModalOpen(false);
    } catch (err) {
      toast.error("Failed to record saving.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Savings & Contributions</h1>
          <p className="text-slate-500 mt-1">Track all member contributions and record new payments.</p>
        </div>
        {canManage && (
          <button onClick={() => setIsSavingModalOpen(true)} className="btn-primary">
            <PlusCircle className="w-4 h-4" />
            Record Saving
          </button>
        )}
      </div>

      <div className="table-container">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
          <Wallet className="w-5 h-5 text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-800">Contribution History</h2>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-600" />
            <p>Loading contributions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Meeting</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((row) => (
                  <tr key={row.id}>
                    <td className="font-medium text-slate-900">{row.member}</td>
                    <td className="text-slate-600">{row.meeting}</td>
                    <td className="font-bold text-emerald-600">{formatCurrency(row.amount)}</td>
                    <td>
                      <span className={`badge ${row.method === 'M-Pesa' ? 'badge-success' : 'badge-info'}`}>
                        {row.method}
                      </span>
                    </td>
                    <td className="text-slate-600">{formatDate(row.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Saving Modal --- */}
      {isSavingModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsSavingModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-xl font-bold text-slate-800">Record Saving</h3>
              <button onClick={() => setIsSavingModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleRecordSaving} className="space-y-4 mt-4">
              <div>
                <label className="label">Member Name</label>
                <select name="member_id" className="input" required>
                  <option value="">Select a member...</option>
                  <option value="1">John Doe</option>
                  <option value="2">Jane Smith</option>
                </select>
              </div>
              <div>
                <label className="label">Linked Meeting (Optional)</label>
                <select name="meeting_id" className="input">
                  <option value="">Select meeting...</option>
                  <option value="1">October Meetup</option>
                  <option value="2">November Meetup</option>
                </select>
              </div>
              <div>
                <label className="label">Amount Contributed (KES)</label>
                <input type="number" name="amount" className="input" required min="1" placeholder="500" />
              </div>
              <div>
                <label className="label">Payment Method</label>
                <select name="method" className="input" required>
                  <option value="Cash">Cash</option>
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="label">Date of Contribution</label>
                <input 
                  type="date" 
                  name="date" 
                  className="input" 
                  required 
                  min={today} 
                  defaultValue={today}
                />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsSavingModalOpen(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-success">
                  <Save className="w-4 h-4" /> Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Savings;
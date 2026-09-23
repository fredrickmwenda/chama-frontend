// src/pages/Finance.jsx
import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuthContext } from '../hooks/useAuth';
import { formatCurrency, formatDate } from '../utils/formatters';
import RepaymentForm from '../forms/RepaymentForm';
import { TrendingDown, Loader2, Wallet, HandCoins, PlusCircle } from 'lucide-react';

const Finance = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  const canManage = user && ['Super Admin', 'Admin User', 'Finance Manager'].includes(user.role);

  const fetchLoans = () => {
    setIsLoading(true);
    api.get('/loans/')
      .then(res => setLoans(res.data))
      .catch(err => console.error('Failed to fetch finance data:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { 
    fetchLoans(); 
  }, []);

  // Mock data for the summary cards (Replace these with actual API data later)
  const stats = {
    totalSavings: 450000,
    totalExpenses: 125000,
    activeLoans: 210000
  };

  const summaryCards = [
    { title: 'Total Savings', value: formatCurrency(stats.totalSavings), icon: <Wallet className="w-6 h-6 text-emerald-600" />, color: 'bg-emerald-50' },
    { title: 'Total Expenses', value: formatCurrency(stats.totalExpenses), icon: <TrendingDown className="w-6 h-6 text-red-600" />, color: 'bg-red-50' },
    { title: 'Active Loans', value: formatCurrency(stats.activeLoans), icon: <HandCoins className="w-6 h-6 text-amber-600" />, color: 'bg-amber-50' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <TrendingDown className="w-8 h-8 text-red-600" /> 
            Finance & Expenses
          </h1>
          <p className="text-slate-500 mt-1">Overview of Chama funds, expenses, and active loan liabilities.</p>
        </div>
        {canManage && (
          <button className="btn-primary">
            <PlusCircle className="w-4 h-4" />
            Record Expense
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <div key={index} className="card flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase">{card.title}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.color}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Active Loans Table */}
      <div className="table-container">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
          <HandCoins className="w-5 h-5 text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-800">Active Loan Liabilities</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Principal</th>
                <th>Date Applied</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <Loader2 className="w-8 h-8 animate-spin mb-3 text-red-600" />
                      Loading finance data...
                    </div>
                  </td>
                </tr>
              ) : loans.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-500">
                    No active loans found.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="font-bold text-slate-900">#{loan.id}</td>
                    <td className="font-medium text-slate-700">{formatCurrency(loan.principal)}</td>
                    <td>{formatDate(loan.date_applied)}</td>
                    <td>
                      {loan.is_paid ? (
                        <span className="badge-success">Paid</span>
                      ) : (
                        <span className="badge-warning">Active</span>
                      )}
                    </td>
                    <td className="text-right">
                      {!loan.is_paid && (
                        <button 
                          onClick={() => setSelectedLoan(loan)} 
                          className="btn-ghost text-indigo-600 hover:bg-indigo-50 text-xs"
                        >
                          Record Repayment
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Repayment Modal */}
      {selectedLoan && (
        <RepaymentForm 
          loan={selectedLoan} 
          onClose={() => setSelectedLoan(null)} 
          onSuccess={fetchLoans} 
        />
      )}
    </div>
  );
};

export default Finance;
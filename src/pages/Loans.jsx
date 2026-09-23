// src/pages/Loans.jsx
import { useEffect, useState } from 'react';
import api from '../api/api';// Fixed path
import { useAuthContext } from '../hooks/useAuth'; // For role-based access
import { formatCurrency, formatDate } from '../utils/formatters';
import RepaymentForm from '../forms/RepaymentForm';
import { HandCoins, Loader2, PlusCircle, FileText, CheckCircle } from 'lucide-react';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  const canManage = user && ['Super Admin', 'Admin User', 'Finance Manager'].includes(user.role);

  const fetchLoans = () => {
    setIsLoading(true);
    api.get('/loans/')
      .then(res => setLoans(res.data))
      .catch(err => console.error('Failed to fetch loans:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { 
    fetchLoans(); 
  }, []);

  // Helper function to render the correct status badge
  const renderStatus = (loan) => {
    if (loan.is_paid) return <span className="badge-success">Paid</span>;
    if (loan.status === 'Pending') return <span className="badge-warning">Pending</span>;
    if (loan.status === 'Rejected') return <span className="badge-danger">Rejected</span>;
    return <span className="badge-info">Active</span>;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <HandCoins className="w-8 h-8 text-amber-600" /> 
            Loans Management
          </h1>
          <p className="text-slate-500 mt-1">Track applications, disburse funds, and record repayments.</p>
        </div>
        {canManage && (
          <button className="btn-primary">
            <PlusCircle className="w-4 h-4" />
            Issue New Loan
          </button>
        )}
      </div>
      
      {/* Loans Table Card */}
      <div className="table-container">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
          <FileText className="w-5 h-5 text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-800">All Loan Applications</h2>
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
                      <Loader2 className="w-8 h-8 animate-spin mb-3 text-amber-600" />
                      Loading loans...
                    </div>
                  </td>
                </tr>
              ) : loans.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-500">
                    <CheckCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    No loan applications found.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="font-bold text-slate-900">#{loan.id}</td>
                    <td className="font-medium text-slate-700">{formatCurrency(loan.principal)}</td>
                    <td>{formatDate(loan.date_applied)}</td>
                    <td>{renderStatus(loan)}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* If loan is active, show Repayment button */}
                        {!loan.is_paid && loan.status === 'Disbursed' && (
                          <button 
                            onClick={() => setSelectedLoan(loan)} 
                            className="btn-ghost text-emerald-600 hover:bg-emerald-50 text-xs"
                          >
                            Record Repayment
                          </button>
                        )}
                        
                        {/* If loan is pending, show Review button (Admins only) */}
                        {canManage && loan.status === 'Pending' && (
                          <button className="btn-ghost text-indigo-600 hover:bg-indigo-50 text-xs">
                            Review
                          </button>
                        )}

                        {/* If loan is paid, show disabled/done state */}
                        {loan.is_paid && (
                          <span className="text-xs text-slate-400 italic">Completed</span>
                        )}
                      </div>
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

export default Loans;
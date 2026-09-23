import { useState } from 'react';
import api from '../api/api';
import Modal from '../ui/Modal';
import { formatCurrency } from '../utils/formatters';

const RepaymentForm = ({ loan, onClose, onSuccess }) => {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/loans/${loan.id}/repay/`, { amount: parseFloat(amount) });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error processing repayment.');
    }
  };

  return (
    <Modal title={`Repay Loan #${loan.id}`} onClose={onClose}>
      <div className="bg-slate-50 p-4 rounded-lg mb-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-500">Principal:</span>
          <span className="font-medium">{formatCurrency(loan.principal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Interest Rate:</span>
          <span className="font-medium">{loan.interest_rate}%</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Payment Amount (KES)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            className="input" 
            required 
            autoFocus
          />
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">{error}</div>}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" className="btn-success flex-1">Submit Payment</button>
        </div>
      </form>
    </Modal>
  );
};

export default RepaymentForm;
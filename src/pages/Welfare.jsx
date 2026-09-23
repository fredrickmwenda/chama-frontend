import { useEffect, useState } from 'react';
import api from '../api/api';
import { formatCurrency } from '../utils/formatters';
import { HeartPulse, AlertCircle } from 'lucide-react';

const Welfare = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    api.get('/welfare/cases/').then(res => setCases(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
        <HeartPulse className="w-8 h-8 text-pink-600" /> Welfare Fund
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.length === 0 ? (
          <div className="col-span-full card flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500">No active welfare cases at the moment.</p>
          </div>
        ) : (
          cases.map(c => {
            const progress = c.target_amount > 0 ? (c.amount_raised / c.target_amount) * 100 : 0;
            return (
              <div key={c.id} className="card flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`badge ${c.case_type === 'Death' ? 'badge-danger' : 'badge-warning'} mb-2`}>
                      {c.case_type}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">Member Support</h3>
                    <p className="text-xs text-slate-500">Case ID: #{c.id}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">Raised: {formatCurrency(c.amount_raised)}</span>
                    <span className="text-slate-500">Goal: {formatCurrency(c.target_amount)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-pink-600 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                {c.is_active ? (
                  <button className="btn-primary w-full mt-auto">Contribute Now</button>
                ) : (
                  <div className="mt-auto text-center text-sm font-semibold text-emerald-600 bg-emerald-50 py-2 rounded-lg">
                    Target Reached!
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Welfare;
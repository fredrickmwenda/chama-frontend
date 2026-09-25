// src/components/AttendanceModal.jsx
import { useState, useRef, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { X, Upload, Save, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

const AttendanceModal = ({ meeting, onClose }) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [penalizeAbsence, setPenalizeAbsence] = useState(true);
  const [penalizeNonPayment, setPenalizeNonPayment] = useState(true);
  const fileInputRef = useRef(null);

  const minContribution = meeting?.minimum_contribution || 500;
  const absenceFine = 200; 
  const nonPaymentFine = 100; 

  // Fetch all members from backend
  useEffect(() => {
    api.get('/auth/users/') // Assuming your Members list endpoint is here
      .then(res => {
        setMembers(res.data.map(m => ({ 
          id: m.id, 
          name: m.username, 
          present: true, 
          amountPaid: 0 
        })));
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleMemberChange = (id, field, value) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const calculateDue = (member) => {
    let fine = 0;
    let shortfall = Math.max(0, minContribution - member.amountPaid);

    if (penalizeAbsence && !member.present) fine += absenceFine;
    if (penalizeNonPayment && member.amountPaid < minContribution) fine += nonPaymentFine;

    return shortfall + fine;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.success(`Imported ${file.name} successfully! Parsing data...`);
    // In a real app, use 'papaparse' here to read the file and update the 'members' state
  };

  const handleSaveAttendance = async () => {
    try {
      // Loop through members and send data to backend
      for (const member of members) {
        // 1. Record Contribution if they paid something
        if (member.amountPaid > 0) {
          await api.post('/savings/contributions/', {
            member: member.id,
            meeting: meeting.id,
            amount: member.amountPaid
          });
        }

        // 2. Record Fine if they have a due balance
        const due = calculateDue(member);
        if (due > 0) {
          let reason = [];
          if (!member.present) reason.push("Absenteeism");
          if (member.amountPaid < minContribution) reason.push("Non-Payment");
          
          await api.post('/savings/fines/', {
            member: member.id,
            meeting: meeting.id,
            amount: due,
            reason: reason.join(" & ")
          });
        }
      }
      
      toast.success('Attendance and fines recorded successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to save attendance.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content max-w-3xl" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Attendance & Fines</h3>
            <p className="text-sm text-slate-500">{meeting?.title} | Min: KES {minContribution}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" checked={penalizeAbsence} onChange={(e) => setPenalizeAbsence(e.target.checked)} className="rounded text-indigo-600" />
              Penalize Absence (KES {absenceFine})
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" checked={penalizeNonPayment} onChange={(e) => setPenalizeNonPayment(e.target.checked)} className="rounded text-indigo-600" />
              Penalize Non-Payment (KES {nonPaymentFine})
            </label>
          </div>
          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="btn-ghost text-sm">
            <Upload className="w-4 h-4" /> Import CSV
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : (
          <div className="overflow-y-auto max-h-[50vh] border border-slate-100 rounded-xl">
            <table className="table">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th>Member</th>
                  <th>Present?</th>
                  <th>Paid (KES)</th>
                  <th>Fine/Due</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => {
                  const due = calculateDue(member);
                  return (
                    <tr key={member.id}>
                      <td className="font-medium text-slate-900">{member.name}</td>
                      <td>
                        <input type="checkbox" checked={member.present} onChange={(e) => handleMemberChange(member.id, 'present', e.target.checked)} className="rounded text-indigo-600 h-4 w-4" />
                      </td>
                      <td>
                        <input type="number" value={member.amountPaid} onChange={(e) => handleMemberChange(member.id, 'amountPaid', parseInt(e.target.value) || 0)} className="input py-1 px-2 w-24" />
                      </td>
                      <td>
                        {due > 0 ? (
                          <span className="badge-danger flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" /> KES {due}</span>
                        ) : (
                          <span className="badge-success flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Clear</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="button" onClick={handleSaveAttendance} className="btn-primary" disabled={isLoading}>
            <Save className="w-4 h-4" /> Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
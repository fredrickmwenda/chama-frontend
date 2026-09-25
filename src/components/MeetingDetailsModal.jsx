// src/components/MeetingDetailsModal.jsx
import { useState, useEffect, useMemo } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { X, Search, Save, FileText, Loader2 } from 'lucide-react';

const MeetingDetailsModal = ({ meeting, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [minutes, setMinutes] = useState(meeting?.minutes || '');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch contributions and fines for this specific meeting
    Promise.all([
      api.get('/savings/contributions/', { params: { meeting: meeting.id } }),
      api.get('/savings/fines/', { params: { meeting: meeting.id } })
    ]).then(([contribRes, finesRes]) => {
      // Combine them into a readable format
      const combined = contribRes.data.map(c => {
        const fine = finesRes.data.find(f => f.member === c.member);
        return { 
          id: c.id, 
          name: c.member_name, 
          paid: c.amount, 
          fine: fine ? fine.amount : 0, 
          present: true 
        };
      });
      setAttendance(combined);
    }).catch(err => console.error(err))
    .finally(() => setIsLoading(false));
  }, [meeting]);

  const filteredAttendance = useMemo(() => {
    if (!searchQuery) return attendance;
    return attendance.filter(member => member.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, attendance]);

  const handleSaveMinutes = async () => {
    try {
      await api.patch(`/savings/meetings/${meeting.id}/`, { minutes: minutes });
      toast.success('Meeting minutes saved successfully!');
      onClose();
    } catch (err) {
      toast.error('Failed to save minutes.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content max-w-4xl" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{meeting?.title} - Details</h3>
            <p className="text-sm text-slate-500">{new Date(meeting?.date).toDateString()}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-slate-700 mb-2 uppercase">Attendance Record</h4>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Filter members..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-9 py-2 text-sm" />
            </div>

            <div className="border border-slate-100 rounded-xl overflow-y-auto max-h-60">
              <table className="table">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th>Member</th>
                    <th>Paid</th>
                    <th>Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="3" className="text-center py-4"><Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" /></td></tr>
                  ) : filteredAttendance.length === 0 ? (
                    <tr><td colSpan="3" className="text-center text-slate-400 py-4 text-sm">No records found.</td></tr>
                  ) : (
                    filteredAttendance.map(member => (
                      <tr key={member.id}>
                        <td className="font-medium text-slate-900 text-sm">{member.name}</td>
                        <td className="text-slate-600 text-sm">KES {member.paid}</td>
                        <td className="text-red-600 font-medium text-sm">{member.fine > 0 ? `KES ${member.fine}` : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-slate-700 mb-2 uppercase flex items-center gap-2">
              <FileText className="w-4 h-4" /> Minutes & Readings
            </h4>
            <textarea className="input flex-1 resize-none min-h-[240px] text-sm leading-relaxed" placeholder="Write down the agenda discussed, decisions made, and readings for the next meeting..." value={minutes} onChange={(e) => setMinutes(e.target.value)} />
          </div>
        </div>

        <div className="modal-footer mt-6">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="button" onClick={handleSaveMinutes} className="btn-primary">
            <Save className="w-4 h-4" /> Save Minutes
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsModal;
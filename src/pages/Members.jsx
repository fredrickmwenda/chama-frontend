// src/pages/Members.jsx
import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuthContext } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Users, PlusCircle, Loader2, Mail, ShieldCheck } from 'lucide-react';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  const canManage = user && ['Super Admin', 'Admin User'].includes(user.role);

  const fetchMembers = () => {
    setIsLoading(true);
    api.get('/auth/users/') // Assuming your Django backend has an endpoint to list users
      .then(res => setMembers(res.data))
      .catch(err => {
        console.error('Failed to fetch members:', err);
        toast.error('Could not load members list.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const getRoleBadge = (role) => {
    if (role === 'Super Admin') return <span className="badge-info">{role}</span>;
    if (role === 'Finance Manager') return <span className="badge-success">{role}</span>;
    return <span className="badge-warning">{role}</span>;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-600" /> Members
          </h1>
          <p className="text-slate-500 mt-1">View all registered Chama members and their roles.</p>
        </div>
        {canManage && (
          <button className="btn-primary" onClick={() => toast('Add Member Modal coming soon!')}>
            <PlusCircle className="w-4 h-4" />
            Add Member
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-800">Registered Members</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-600" />
                      Loading members...
                    </div>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-500">
                    No members found.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id}>
                    <td className="font-medium text-slate-900">
                      {member.username}
                      {member.id === user?.id && <span className="text-xs text-indigo-500 ml-2">(You)</span>}
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {member.email || 'No email provided'}
                      </div>
                    </td>
                    <td>{getRoleBadge(member.role)}</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Members;
// src/pages/Settings.jsx
import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuth';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon, Save, KeyRound, UserCircle } from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useAuthContext();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await api.patch('/auth/profile/', profileData);
      updateUser(res.data); // Update global state
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      return toast.error('New passwords do not match.');
    }
    setIsUpdatingPassword(true);
    try {
      await api.post('/auth/change-password/', passwordData);
      toast.success('Password changed successfully!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to change password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-slate-600" /> Settings
        </h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Profile Settings Card */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <UserCircle className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-slate-800">Profile Information</h2>
          </div>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="label">Username</label>
              <input 
                type="text" 
                value={profileData.username} 
                onChange={e => setProfileData({...profileData, username: e.target.value})}
                className="input" 
              />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input 
                type="email" 
                value={profileData.email} 
                onChange={e => setProfileData({...profileData, email: e.target.value})}
                className="input" 
              />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input 
                type="text" 
                value={profileData.phone} 
                onChange={e => setProfileData({...profileData, phone: e.target.value})}
                className="input" 
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={isUpdatingProfile}>
              <Save className="w-4 h-4" />
              {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Security / Password Card */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <KeyRound className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-slate-800">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <input 
                type="password" 
                value={passwordData.current_password} 
                onChange={e => setPasswordData({...passwordData, current_password: e.target.value})}
                className="input" 
                required
              />
            </div>
            <div>
              <label className="label">New Password</label>
              <input 
                type="password" 
                value={passwordData.new_password} 
                onChange={e => setPasswordData({...passwordData, new_password: e.target.value})}
                className="input" 
                required
              />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input 
                type="password" 
                value={passwordData.confirm_password} 
                onChange={e => setPasswordData({...passwordData, confirm_password: e.target.value})}
                className="input" 
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={isUpdatingPassword}>
              <KeyRound className="w-4 h-4" />
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Settings;
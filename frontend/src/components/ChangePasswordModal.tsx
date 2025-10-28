import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (formData.new_password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('http://localhost:8000/api/users/change-password', {
        current_password: formData.current_password,
        new_password: formData.new_password
      });
      
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      
      setTimeout(() => {
        onClose();
        setFormData({ current_password: '', new_password: '', confirm_password: '' });
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to change password' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({ current_password: '', new_password: '', confirm_password: '' });
    setMessage({ type: '', text: '' });
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${
        isDark
          ? 'bg-black/60'
          : 'bg-white/60'
      }`}>
      <div className={`relative w-full max-w-md backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border ${
        isDark
          ? 'bg-white/10 border-white/20'
          : 'bg-black/10 border-black/20'
      }`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
            isDark
              ? 'hover:bg-white/10 text-gray-400 hover:text-white'
              : 'hover:bg-black/10 text-gray-600 hover:text-black'
          }`}
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            isDark
              ? 'bg-gradient-to-br from-white via-gray-300 to-gray-500'
              : 'bg-gradient-to-br from-black via-gray-700 to-gray-500'
          }`}>
            <span className={`text-3xl ${isDark ? 'text-black' : 'text-white'}`}>🔒</span>
          </div>
          <h2 className={`text-3xl font-bold bg-clip-text text-transparent mb-2 ${
            isDark
              ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400'
              : 'bg-gradient-to-r from-black via-gray-800 to-gray-600'
          }`}>
            Change Password
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Enter your current password and choose a new one
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 backdrop-blur-xl border px-4 py-3 rounded-xl ${
            message.type === 'success'
              ? isDark
                ? 'bg-green-500/20 border-green-400/30 text-green-100'
                : 'bg-green-500/30 border-green-400/50 text-green-900'
              : isDark
                ? 'bg-red-500/20 border-red-400/30 text-red-100'
                : 'bg-red-500/30 border-red-400/50 text-red-900'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Current Password
            </label>
            <input
              type="password"
              required
              value={formData.current_password}
              onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
              className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                isDark
                  ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50'
                  : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50'
              }`}
              placeholder="Enter current password"
              disabled={loading}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              New Password
            </label>
            <input
              type="password"
              required
              value={formData.new_password}
              onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
              className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                isDark
                  ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50'
                  : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50'
              }`}
              placeholder="Enter new password"
              disabled={loading}
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Min 8 chars, 1 uppercase, 1 number
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                isDark
                  ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50'
                  : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50'
              }`}
              placeholder="Confirm new password"
              disabled={loading}
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-4 font-semibold rounded-xl transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-white via-gray-300 to-gray-500 text-black hover:scale-105'
                  : 'bg-gradient-to-r from-black via-gray-700 to-gray-500 text-white hover:scale-105'
              }`}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className={`px-6 py-3 rounded-xl transition-all ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  : 'bg-black/10 hover:bg-black/20 text-black border border-black/20'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
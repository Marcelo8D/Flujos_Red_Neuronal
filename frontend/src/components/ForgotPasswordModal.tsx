// frontend/src/components/ForgotPasswordModal.tsx
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('http://localhost:8000/api/users/request-reset-code', { email });
      setMessage({ type: 'success', text: 'Reset code sent! Check your email.' });
      setStep('code');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to send code' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('http://localhost:8000/api/users/reset-password-with-code', {
        email,
        code,
        new_password: newPassword
      });
      
      setMessage({ type: 'success', text: 'Password reset successfully! You can now login.' });
      
      setTimeout(() => {
        onClose();
        setStep('email');
        setEmail('');
        setCode('');
        setNewPassword('');
        setConfirmPassword('');
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
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
          onClick={onClose}
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
            <span className={`text-3xl ${isDark ? 'text-black' : 'text-white'}`}>🔑</span>
          </div>
          <h2 className={`text-3xl font-bold bg-clip-text text-transparent mb-2 ${
            isDark
              ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400'
              : 'bg-gradient-to-r from-black via-gray-800 to-gray-600'
          }`}>
            {step === 'email' ? 'Forgot Password?' : 'Enter Reset Code'}
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {step === 'email' 
              ? 'Enter your email to receive a reset code' 
              : 'Check your email for the 6-digit code'}
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

        {/* Step 1: Email */}
        {step === 'email' && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50'
                    : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50'
                }`}
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 font-semibold rounded-xl transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-white via-gray-300 to-gray-500 text-black hover:scale-105'
                  : 'bg-gradient-to-r from-black via-gray-700 to-gray-500 text-white hover:scale-105'
              }`}
            >
              {loading ? 'Sending...' : '📧 Send Reset Code'}
            </button>
          </form>
        )}

        {/* Step 2: Code & New Password */}
        {step === 'code' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                6-Digit Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all text-center text-2xl tracking-widest ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50'
                    : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50'
                }`}
                placeholder="000000"
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50'
                    : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50'
                }`}
                placeholder="Enter new password"
                disabled={loading}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50'
                    : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50'
                }`}
                placeholder="Confirm new password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 font-semibold rounded-xl transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-white via-gray-300 to-gray-500 text-black hover:scale-105'
                  : 'bg-gradient-to-r from-black via-gray-700 to-gray-500 text-white hover:scale-105'
              }`}
            >
              {loading ? 'Resetting...' : '🔒 Reset Password'}
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className={`w-full py-2 text-sm ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              ← Back to email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
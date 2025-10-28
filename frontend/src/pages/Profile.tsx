import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import ChangePasswordModal from '../components/ChangePasswordModal';

interface ProfileData {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellidos: string;
  fecha_registro: string;
}

const Profile: React.FC = () => {
  const { isDark } = useTheme();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  const [editForm, setEditForm] = useState({
    nombre: '',
    apellidos: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('http://localhost:8000/api/users/me');
      setProfileData(response.data);
      setEditForm({
        nombre: response.data.nombre || '',
        apellidos: response.data.apellidos || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('http://localhost:8000/api/users/me', editForm);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      fetchProfile();
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className={`backdrop-blur-xl rounded-3xl p-8 border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-black/5 border-black/10'
      }`}>
        <h1 className={`text-4xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-black'
        }`}>
          👤 Profile Settings
        </h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Manage your account settings and preferences
        </p>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`backdrop-blur-xl rounded-xl p-4 border animate-shake ${
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
      {/* Lava Lamp Background */}
      <div className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-white'}`}>
        {/* Large visible orbs */}
        <div className={`absolute top-0 -left-20 w-96 h-96 rounded-full filter blur-3xl opacity-30  ${
          isDark ? 'mix-blend-screen bg-white' : ' mix-blend-multiply bg-black'
        }`}></div>
        <div className={`absolute top-20 right-10 w-[500px] h-[500px] rounded-full filter blur-3xl opacity-40  ${
          isDark ? 'mix-blend-screen bg-gray-300' : 'mix-blend-multiply bg-gray-700'
        }`}></div>
        <div className={`absolute -bottom-20 left-1/4 w-[450px] h-[450px] rounded-full filter blur-3xl opacity-35  ${
          isDark ? 'mix-blend-screen bg-gray-500' : 'mix-blend-multiply bg-gray-500'
        }`}></div>
        <div className={`absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full filter blur-3xl opacity-25  ${
          isDark ? 'mix-blend-screen bg-white' : 'mix-blend-multiply bg-black'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 w-[350px] h-[350px] rounded-full filter blur-3xl opacity-30  ${
          isDark ? 'mix-blend-screen bg-gray-400' : 'mix-blend-multiply bg-gray-600'
        }`}></div>
        <div className={`absolute top-0 right-1/2 w-[300px] h-[300px] rounded-full filter blur-3xl opacity-30  ${
          isDark ? 'mix-blend-screen bg-gray-400' : 'mix-blend-multiply bg-gray-600'
        }`}></div>
       </div>

      {/* Profile Information Card */}
      <div className={`backdrop-blur-xl rounded-3xl p-8 border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-black/5 border-black/10'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            Personal Information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  : 'bg-black/10 hover:bg-black/20 text-black border border-black/20'
              }`}
            >
              ✏️ Edit
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Username</label>
                <p className={`text-lg font-medium ${
                  isDark ? 'text-white' : 'text-black'
                }`}>{profileData.username}</p>
              </div>
              <div>
                <label className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Email</label>
                <p className={`text-lg font-medium ${
                  isDark ? 'text-white' : 'text-black'
                }`}>{profileData.email}</p>
              </div>
              <div>
                <label className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Nombre</label>
                <p className={`text-lg font-medium ${
                  isDark ? 'text-white' : 'text-black'
                }`}>{profileData.nombre}</p>
              </div>
              <div>
                <label className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Apellidos</label>
                <p className={`text-lg font-medium ${
                  isDark ? 'text-white' : 'text-black'
                }`}>{profileData.apellidos || '-'}</p>
              </div>
            </div>
            <div>
              <label className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Member since</label>
              <p className={`text-lg font-medium ${
                isDark ? 'text-white' : 'text-black'
              }`}>{new Date(profileData.fecha_registro).toLocaleDateString()}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Nombre</label>
                <input
                  type="text"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                  className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    isDark
                      ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50'
                      : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Apellidos</label>
                <input
                  type="text"
                  value={editForm.apellidos}
                  onChange={(e) => setEditForm({ ...editForm, apellidos: e.target.value })}
                  className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    isDark
                      ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50'
                      : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50'
                  }`}
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  isDark
                    ? 'bg-gradient-to-r from-white via-gray-300 to-gray-500 text-black hover:scale-105'
                    : 'bg-gradient-to-r from-black via-gray-700 to-gray-500 text-white hover:scale-105'
                }`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
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
        )}
      </div>

      {/* Change Password Card */}
      <div className={`backdrop-blur-xl rounded-3xl p-8 border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-black/5 border-black/10'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              🔒 Security
            </h2>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Manage your password</p>
          </div>
          <button
            onClick={() => setShowChangePassword(true)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'bg-black/10 hover:bg-black/20 text-black border border-black/20'
            }`}
          >
            Change Password
          </button>
        </div>
      </div>

    <ChangePasswordModal 
        isOpen={showChangePassword} 
        onClose={() => setShowChangePassword(false)} 
    />
    </div>
  );
};

export default Profile;
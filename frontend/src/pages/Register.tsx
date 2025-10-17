import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellidos: '',
    gdpr_consent: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.gdpr_consent) {
      setError('You must accept the privacy policy to register');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 py-12">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 p-3 rounded-lg transition-all duration-300 ${
          isDark
            ? 'bg-white/10 hover:bg-white/20 border border-white/20'
            : 'bg-black/10 hover:bg-black/20 border border-black/20'
        }`}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <span className="text-2xl">{isDark ? '☀️' : '🌙'}</span>
      </button>

      {/* Lava Lamp Background */}
      <div className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-white'}`}>
        
        <div className={`absolute top-0 -left-20 w-96 h-96 rounded-full filter blur-3xl opacity-30 animate-blob ${
          isDark ? 'mix-blend-screen bg-white' : ' mix-blend-multiply bg-black'
        }`}></div>
        <div className={`absolute top-20 right-10 w-[500px] h-[500px] rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000 ${
          isDark ? 'mix-blend-screen bg-gray-300' : 'mix-blend-multiply bg-gray-700'
        }`}></div>
        <div className={`absolute -bottom-20 left-1/4 w-[450px] h-[450px] rounded-full filter blur-3xl opacity-35 animate-blob-reverse animation-delay-4000 ${
          isDark ? 'mix-blend-screen bg-gray-500' : 'mix-blend-multiply bg-gray-500'
        }`}></div>
        <div className={`absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full filter blur-3xl opacity-25 animate-blob animation-delay-6000 ${
          isDark ? 'mix-blend-screen bg-white' : 'mix-blend-multiply bg-black'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 w-[350px] h-[350px] rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-3000 ${
          isDark ? 'mix-blend-screen bg-gray-400' : 'mix-blend-multiply bg-gray-600'
        }`}></div>
        <div className={`absolute top-0 right-1/2 w-[300px] h-[300px] rounded-full filter blur-3xl opacity-30 animate-blob-reverse animation-delay-3000 ${
          isDark ? 'mix-blend-screen bg-gray-400' : 'mix-blend-multiply bg-gray-600'
        }`}></div>
        
        {/* Overlay for text readability */}
        <div className={isDark ? 'absolute inset-0 bg-black/40' : 'absolute inset-0 bg-white/40'}></div>
      </div>

      {/* Background2 */}
      <div className="relative z-10 w-full max-w-3xl">
        <div className={`relative backdrop-blur-3xl p-8 rounded-3xl shadow-2xl border ${
          isDark
            ? 'bg-white/10 border-white/20'
            : 'bg-black/10 border-black/20'
        }`}>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-2xl ${
                isDark
                  ? 'bg-gradient-to-br from-white via-gray-300 to-gray-500 shadow-white/30'
                  : 'bg-gradient-to-br from-black via-gray-700 to-gray-500 shadow-black/30'
              }`}>
                <span className={`font-bold text-3xl ${
                  isDark ? 'text-black' : 'text-white'
                }`}>N</span>
              </div>
              <h1 className={`text-4xl font-bold bg-clip-text text-transparent mb-2 ${
                isDark
                  ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400'
                  : 'bg-gradient-to-r from-black via-gray-800 to-gray-600'
              }`}>
                Create Account
              </h1>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                Join Neural Viz Platform
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`mb-6 backdrop-blur-xl border px-4 py-3 rounded-xl animate-shake ${
                isDark
                  ? 'bg-red-500/20 border-red-400/30 text-red-100'
                  : 'bg-red-500/30 border-red-400/50 text-red-900'
              }`}>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="group">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Username <span className={isDark ? 'text-white' : 'text-black'}>*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50 hover:bg-white/15'
                        : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50 hover:bg-black/15'
                    }`}
                    placeholder="Choose a username"
                    disabled={loading}
                  />
                </div>

                {/* Email */}
                <div className="group">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email <span className={isDark ? 'text-white' : 'text-black'}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50 hover:bg-white/15'
                        : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50 hover:bg-black/15'
                    }`}
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>

                {/* Nombre */}
                <div className="group">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Nombre <span className={isDark ? 'text-white' : 'text-black'}>*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50 hover:bg-white/15'
                        : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50 hover:bg-black/15'
                    }`}
                    placeholder="Juan"
                    disabled={loading}
                  />
                </div>

                {/* Apellidos */}
                <div className="group">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Apellidos
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50 hover:bg-white/15'
                        : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50 hover:bg-black/15'
                    }`}
                    placeholder="Garcia"
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="group">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Password <span className={isDark ? 'text-white' : 'text-black'}>*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50 hover:bg-white/15'
                        : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50 hover:bg-black/15'
                    }`}
                    placeholder="********"
                    disabled={loading}
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Min 8 chars, 1 uppercase, 1 number
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="group">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Confirm Password <span className={isDark ? 'text-white' : 'text-black'}>*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50 hover:bg-white/15'
                        : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50 hover:bg-black/15'
                    }`}
                    placeholder="********"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* GDPR Consent */}
              <div className={`backdrop-blur-xl p-5 rounded-xl border ${
                isDark
                  ? 'bg-white/5 border-white/10'
                  : 'bg-black/5 border-black/10'
              }`}>
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="gdpr_consent"
                    checked={formData.gdpr_consent}
                    onChange={handleChange}
                    className={`mt-1 h-5 w-5 rounded focus:ring-2 ${
                      isDark
                        ? 'border-white/30 bg-white/10 text-white focus:ring-white/50'
                        : 'border-black/30 bg-black/10 text-black focus:ring-black/50'
                    }`}
                    disabled={loading}
                  />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
                      className={`underline font-medium transition-colors ${
                        isDark
                          ? 'text-white hover:text-gray-200'
                          : 'text-black hover:text-gray-800'
                      }`}
                      disabled={loading}
                    >
                      Privacy Policy
                    </button>
                    {' '}and GDPR regulations. <span className={isDark ? 'text-white' : 'text-black'}>*</span>
                  </span>
                </label>

                {showPrivacyPolicy && (
                  <div className={`mt-4 p-4 backdrop-blur-xl rounded-lg text-sm space-y-2 max-h-48 overflow-y-auto border ${
                    isDark
                      ? 'bg-white/10 text-gray-300 border-white/10'
                      : 'bg-black/10 text-gray-700 border-black/10'
                  }`}>
                    <p>
                      <strong className={isDark ? 'text-white' : 'text-black'}>📊 Data Collected:</strong> Username, email, name, models, visualizations
                    </p>
                    <p>
                      <strong className={isDark ? 'text-white' : 'text-black'}>🛡️ Your Rights:</strong> Access, correct, delete, portability
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`relative w-full py-3 px-4 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02] hover:shadow-2xl overflow-hidden group ${
                  isDark
                    ? 'bg-gradient-to-r from-white via-gray-300 to-gray-500 text-black hover:shadow-white/30'
                    : 'bg-gradient-to-r from-black via-gray-700 to-gray-500 text-white hover:shadow-black/30'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ${
                  isDark ? 'via-white/40' : 'via-black/40'
                }`}></div>
                <span className="relative z-10">
                  {loading ? 'Creating account...' : 'Create Account'}
                </span>
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className={`font-semibold bg-clip-text text-transparent transition-all ${
                    isDark
                      ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400 hover:from-gray-200 hover:via-gray-100 hover:to-white'
                      : 'bg-gradient-to-r from-black via-gray-800 to-gray-600 hover:from-gray-800 hover:via-gray-700 hover:to-black'
                  }`}
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(40px, -60px) scale(1.15) rotate(120deg); }
          66% { transform: translate(-30px, 30px) scale(0.85) rotate(240deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(360deg); }
        }
        
        @keyframes blob-reverse {
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(-40px, 60px) scale(0.9) rotate(-120deg); }
          66% { transform: translate(30px, -30px) scale(1.1) rotate(-240deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(-360deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-blob {
          animation: blob 12s infinite ease-in-out;
        }
        
        .animate-blob-reverse {
          animation: blob-reverse 15s infinite ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-5000 {
          animation-delay: 5s;
        }
        
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
};

export default Register;
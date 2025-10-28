import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
      {/* Theme Toggle Button - Top Right */}
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
        {/* Large visible orbs */}
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
       </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Background2 */}
        <div className={`relative backdrop-blur-3xl p-8 rounded-3xl shadow-2xl border transform transition-all duration-500 hover:scale-[1.02] ${
          isDark
            ? 'bg-white/10 border-white/20 hover:shadow-white/20'
            : 'bg-black/10 border-black/20 hover:shadow-black/20'
        }`}>
          {/* Content */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transform transition-all duration-300 hover:rotate-12 hover:scale-110 shadow-2xl ${
                isDark
                  ? 'bg-gradient-to-br from-white via-gray-300 to-gray-500 shadow-white/30'
                  : 'bg-gradient-to-br from-black via-gray-700 to-gray-500 shadow-black/30'
              }`}>
                <span className={`font-bold text-4xl ${
                  isDark ? 'text-black' : 'text-white'
                }`}>N</span>
              </div>
              <h1 className={`text-4xl font-bold bg-clip-text text-transparent mb-2 ${
                isDark
                  ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400'
                  : 'bg-gradient-to-r from-black via-gray-800 to-gray-600'
              }`}>
                Neural Viz
              </h1>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                Visualize Neural Networks
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <div className="group">
                <label className={`block text-sm font-medium mb-2 transition-colors ${
                  isDark
                    ? 'text-gray-300 group-focus-within:text-white'
                    : 'text-gray-700 group-focus-within:text-black'
                }`}>
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50 focus:border-white/50 hover:bg-white/15'
                        : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50 focus:border-black/50 hover:bg-black/15'
                    }`}
                    placeholder="Enter your username"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label className={`block text-sm font-medium mb-2 transition-colors ${
                  isDark
                    ? 'text-gray-300 group-focus-within:text-white'
                    : 'text-gray-700 group-focus-within:text-black'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-white/50 focus:border-white/50 hover:bg-white/15'
                        : 'bg-black/10 border-black/20 text-black placeholder-gray-600 focus:ring-black/50 focus:border-black/50 hover:bg-black/15'
                    }`}
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button*/}
              <button
                type="submit"
                disabled={loading}
                className={`relative w-full py-3 px-4 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled: transform hover:scale-[1.02] hover:shadow-2xl overflow-hidden group ${
                  isDark
                    ? 'bg-gradient-to-r from-white via-gray-350 to-gray-500 text-black focus:ring-white/50 hover:shadow-white/30'
                    : 'bg-gradient-to-r from-black via-gray-700 to-gray-500 text-white focus:ring-black/50 hover:shadow-black/30'
                }`}
              >
                {/* Animated shimmer effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ${
                  isDark ? 'via-white/40' : 'via-black/40'
                }`}></div>
                
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? ('Logging in...') : ('Sign In')}
                </span>
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className={isDark ? 'text-gray-300 text-sm' : 'text-gray-700 text-sm'}>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className={`font-semibold bg-clip-text text-transparent transition-all duration-300 ${
                    isDark
                      ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400 hover:from-gray-200 hover:via-gray-100 hover:to-white'
                      : 'bg-gradient-to-r from-black via-gray-800 to-gray-600 hover:from-gray-800 hover:via-gray-700 hover:to-black'
                  }`}
                >
                  Register here
                </Link>
              </p>
            </div>
            <div className="mt-6 text-center">
              <p 
                className={`font-semibold bg-clip-text text-transparent transition-all duration-300`}>
                <span 
                onClick={() => setShowForgotPassword(true)}
                className={`font-semibold bg-clip-text text-transparent transition-all duration-300 cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400 hover:from-gray-200 hover:via-gray-100 hover:to-white'
                    : 'bg-gradient-to-r from-black via-gray-800 to-gray-600 hover:from-gray-800 hover:via-gray-700 hover:to-black'
                }`}
                >Forgot your password?
                </span>
              </p>
            </div>
          </div>
        </div>
        <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
        />
      </div>

      {/* Custom CSS animations */}
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

export default Login;
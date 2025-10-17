import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import SettingsControls from './SettingsControls';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-black' : 'bg-white'
    }`}>
      {/* Header */}
      <header className={`border-b shadow-lg sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-900/80 border-white/10' 
          : 'bg-white/80 border-black/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform ${
                  isDark
                    ? 'bg-gradient-to-br from-white/20 to-gray-400/20'
                    : 'bg-gradient-to-br from-black/20 to-gray-600/20'
                }`}>
                  <span className={`font-bold text-xl ${
                    isDark ? 'text-white' : 'text-black'
                  }`}>N</span>
                </div>
                <span className={`font-bold text-xl transition-colors ${
                  isDark 
                    ? 'text-white group-hover:text-gray-300' 
                    : 'text-black group-hover:text-gray-700'
                }`}>
                  Neural Viz
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`transition-colors font-medium ${
                  isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                Home
              </Link>
              <Link
                to="/models"
                className={`transition-colors font-medium ${
                  isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                Models
              </Link>
              <Link
                to="/projects"
                className={`transition-colors font-medium ${
                  isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                Projects
              </Link>
              <Link
                to="/visualizations"
                className={`transition-colors font-medium ${
                  isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                Visualizations
              </Link>
            </nav>

            {/* Settings Controls & User Menu */}
            <div className="flex items-center space-x-4">
              {/* Settings Controls (Theme) */}
              <SettingsControls />

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 border border-white/20'
                      : 'bg-black/10 hover:bg-black/20 border border-black/20'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark
                      ? 'bg-gradient-to-br from-white/20 to-gray-400/20'
                      : 'bg-gradient-to-br from-black/20 to-gray-600/20'
                  }`}>
                    <span className={`font-semibold text-sm ${
                      isDark ? 'text-white' : 'text-black'
                    }`}>
                      {user?.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={`font-medium hidden sm:block ${
                    isDark ? 'text-white' : 'text-black'
                  }`}>
                    {user?.nombre}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showUserMenu ? 'rotate-180' : ''
                    } ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl border py-2 animate-fadeIn ${
                    isDark
                      ? 'bg-gray-900/95 backdrop-blur-xl border-white/20'
                      : 'bg-white/95 backdrop-blur-xl border-black/20'
                  }`}>
                    <div className={`px-4 py-2 border-b ${
                      isDark ? 'border-white/10' : 'border-black/10'
                    }`}>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>Signed in as</p>
                      <p className={`text-sm font-medium truncate ${
                        isDark ? 'text-white' : 'text-black'
                      }`}>{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 text-sm transition-colors ${
                        isDark
                          ? 'text-gray-300 hover:bg-white/10'
                          : 'text-gray-700 hover:bg-black/10'
                      }`}
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        isDark
                          ? 'text-red-400 hover:bg-white/10'
                          : 'text-red-600 hover:bg-black/10'
                      }`}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
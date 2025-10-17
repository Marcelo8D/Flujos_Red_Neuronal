import React from 'react';
import { useTheme } from '../context/ThemeContext';

const SettingsControls: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className="flex items-center gap-4">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
          isDark 
            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
            : 'bg-black/10 hover:bg-black/20 text-black border border-black/20'
        }`}
        title={isDark ? 'common.lightTheme' : 'common.darkTheme'}
      >
        <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
        <span className="text-sm font-medium">
          {isDark ? 'Light' : 'Dark'}
        </span>
      </button>
    </div>
  );
};

export default SettingsControls;
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('es')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          i18n.language === 'es'
            ? isDark
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-black/20 text-black border border-black/30'
            : isDark
              ? 'bg-white/5 text-gray-400 hover:bg-white/10'
              : 'bg-black/5 text-gray-600 hover:bg-black/10'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => changeLanguage('ca')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          i18n.language === 'ca'
            ? isDark
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-black/20 text-black border border-black/30'
            : isDark
              ? 'bg-white/5 text-gray-400 hover:bg-white/10'
              : 'bg-black/5 text-gray-600 hover:bg-black/10'
        }`}
      >
        CA
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          i18n.language === 'en'
            ? isDark
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-black/20 text-black border border-black/30'
            : isDark
              ? 'bg-white/5 text-gray-400 hover:bg-white/10'
              : 'bg-black/5 text-gray-600 hover:bg-black/10'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSelector;


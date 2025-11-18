import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import caTranslations from './locales/ca.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      ca: { translation: caTranslations },
    },
    lng: localStorage.getItem('language') || 'es', // Default to Spanish
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;


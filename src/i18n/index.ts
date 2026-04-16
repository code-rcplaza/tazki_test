import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esRequests from '../features/requests/locales/es.json';
import enRequests from '../features/requests/locales/en.json';

i18n.use(initReactI18next).init({
  lng: 'es',
  fallbackLng: 'en',
  ns: ['requests'],
  defaultNS: 'requests',
  resources: {
    es: { requests: esRequests },
    en: { requests: enRequests },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

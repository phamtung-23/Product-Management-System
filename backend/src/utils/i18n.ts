import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import path from 'path';

// Initialize i18next
const initI18n = () => {
  i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
      backend: {
        // Path to load translations from
        loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
        // Path to save missing translations
        addPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json')
      },
      detection: {
        // Order of language detection
        order: ['header', 'querystring', 'cookie'],
        // detection strategies
        lookupHeader: 'accept-language',
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
        caches: ['cookie']
      },
      fallbackLng: 'en',
      preload: ['en', 'vi'],
      saveMissing: true,
      ns: ['translation'],
      defaultNS: 'translation'
    });
  
  return i18next;
};

export default initI18n;

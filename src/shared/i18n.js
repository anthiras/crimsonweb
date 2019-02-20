import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import detector from "i18next-browser-languagedetector";
import moment from 'moment';
import 'moment/locale/da';
import translationEN from '../locales/en/translation.json';
import translationENCustom from '../locales/en/translation.custom.json';
import translationDA from '../locales/da/translation.json';
import translationDACustom from '../locales/da/translation.custom.json';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        translation: translationEN
    },
    da: {
        translation: translationDA
    }
};

i18n
    .use(detector)
    .use(reactI18nextModule) // passes i18n down to react-i18next
    .init({
        resources,
        fallbackLng: "da",

        keySeparator: ":",

        interpolation: {
            escapeValue: false, // react already safes from xss
            format: function(value, format, lng) {
                if (value instanceof Date) return moment(value).format(format);
            }
        },

        detection: {
            order: ['cookie', 'navigator'],
            caches: ['cookie'],
            cookieMinutes: 60*24*365,
        },

        missingKeyHandler: function(lng, ns, key, fallbackValue) {
            // We don't want users to see translation keys ever, let's crash the app instead
            throw new Error("Missing translation key: " + key);
        },
        saveMissing: true
    });

i18n.on('languageChanged', function(lng) {
    moment.locale(lng);
});

moment.locale(i18n.language);

i18n.addResourceBundle(
    'da', // lng
    'translation', // ns
    translationDACustom, 
    true, // deep
    true // overwrite
    );
i18n.addResourceBundle(
    'en', // lng
    'translation', // ns
    translationENCustom, 
    true, // deep
    true // overwrite
    );

export default i18n;
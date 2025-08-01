import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./src/locales/en.json";
import translationRU from "./src/locales/ru.json";

//Creating object with the variables of imported translation files
const resources = {
    en: {
        translation: translationEN,
    },
    ru: {
        translation: translationRU,
    },
};


i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", //default language,
        fallbackLng: ['en', 'ru'], // fallback languag
        keySeparator: ":",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
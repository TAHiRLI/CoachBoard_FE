import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationAZE from "./src/locales/aze.json";
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
  aze: {
    translation: translationAZE,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "aze", //default language,
  fallbackLng: ["en", "ru", "aze"], // fallback languag
  keySeparator: ".",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

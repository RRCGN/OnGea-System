import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import backend from "i18next-xhr-backend";
import {config} from "../config/config";
import translationEN from '../fallbackLang/en/translations.json';


const resources = {
  en: {
    translations: translationEN
  }
};


i18n
  .use(backend)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    backend: {
      // for all available options read the backend's repository readme file
      loadPath: config.basePath+config.langPath,
    },
    lng: config.lang,
    
    fallbackLng: "en",
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: false, // we do not use keys in form messages.welcome
    debug:false,
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      wait: true,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    }
  });

  export default i18n;
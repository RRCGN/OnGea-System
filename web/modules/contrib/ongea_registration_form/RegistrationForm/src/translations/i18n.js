import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import backend from "i18next-xhr-backend";
import {config} from "../config/config";


// the translations
// (tip move them in a JSON file and import them)



i18n
  .use(backend)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    //resources,
    
    lng: config.lang,
    
    fallbackLng: "en",
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: false, // we do not use keys in form messages.welcome

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
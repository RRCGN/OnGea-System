import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { reactI18nextModule } from 'react-i18next';
import Backend from 'i18next-xhr-backend';
import { config } from '../config/config';


i18n.use(LanguageDetector).use(reactI18nextModule).use(Backend)
.init({
  // we init with resources
  /*resources: {
    en: {
      translations: {
        "Activity": "Activiy",
        "Activity_plural": "Activities",
        "Mobility": "Mobility",
        "Mobility_plural": "Mobilities",
        "Welcome to React": "Welcome to React and react-i18next",
        "Dashboard": "Dashboard",
        "Project": "Project",
        "Project_plural": "Projects",
        "New project": "New project",
        "Language": "Language",
        "English": "English",
        "German": "German",
        "item": "item",
        "item_plural": "items",
        "itemWithCount": "{{count}} item",
        "Dashboard.Intro.ProjectText":"Projects have a start, an end and normally specific funding from one or more funders. They are the frame for activities. A project may run for a long time and contain several activities.",
        "Add new project": "Add new project",
        "Rows per page": "Rows per page"
      }
    },
    de: {
      translations: {
        "Activity": "Aktivität",
        "Activity_plural": "Aktivitäten",
        "Mobility": "Mobility",
        "Mobility_plural": "Mobilitäten",
        "Welcome to React": "Willkommen bei React und react-i18next",
        "Dashboard": "Dashboard",
        "Project": "Projekt",
        "Project_plural": "Projekte",
        "New project": "Neues Projekt",
        "Add new project": "Neues Projekt",
        "My projects": "Meine Projekte",
        "Language": "Sprache",
        "English": "Englisch",
        "German": "Deutsch",
        "item": "Element",
        "item_plural": "Elemente",
        "itemWithCount": "{{count}} Elemente",
        "Get started …": "Los gehts …",
        "Dashboard.Intro.ProjectText": "Super Text der hier steht",
        "Rows per page": "Zeilen pro Seite"
      }
    }
  },*/
  backend: {
    // for all available options read the backend's repository readme file
    loadPath: process.env.PUBLIC_URL+'/locales/{{lng}}/{{ns}}.json',
    //parse: function(data) { return data;/*.replace(/a/g, '');*/ },
  },
  fallbackLng: "en",
  debug: false,
  lng: config.lang,
  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",
  nsSeparator: false,
  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  },

  react: {
    wait: true,
    bindI18n: 'languageChanged loaded',
    bindStore: 'added removed',
    nsMode: 'default'
    
  }
});

export default i18n;

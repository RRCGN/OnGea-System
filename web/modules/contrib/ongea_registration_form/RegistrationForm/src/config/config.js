import axios from 'axios';


var configT;
const rootElem = document.getElementById('ongea_activity_signupform');
if(rootElem){
     configT = {
    lang:rootElem.getAttribute('data-lang'),
    langPath: rootElem.getAttribute('data-langPath').replace(/\/\s*$/, "")+'/' + rootElem.getAttribute('data-lang') + '/translations.json',
    basePath: rootElem.getAttribute('data-basePath').replace(/\/\s*$/, ""),
    appLoginUrl: rootElem.getAttribute('data-appLoginUrl') ? rootElem.getAttribute('data-appLoginUrl').replace(/\/\s*$/, "") : null,
    appName: rootElem.getAttribute('data-appName'),
    activityId: rootElem.getAttribute('data-activityid'),
    sendingOrganisationId: rootElem.getAttribute('data-sendingorganisationId'),
    edit: (rootElem.getAttribute('data-edit') === true || rootElem.getAttribute('data-edit') === 'true') ? true : false
  }
}else{
   configT = {
    lang:'en',
    langPath: '',
    basePath: '',
    appLoginUrl: null,
    appName: '',
    activityId: '',
    sendingOrganisationId: '',
    edit: ''}
}
export const config = configT;
console.log('rootElement', rootElem);
console.log('config.basePath', config.basePath);
var csrfToken;
axios.get(config.basePath+'/rest/session/token').then(response => {
  csrfToken = response.data;
}).catch(error => {
  console.log(error);
})
export const apiConfig = {
    baseUrl: config.basePath+'/api/v2',
    configureHeaders(headers) {
      var basicAuth = {'Authorization' : 'Basic aGFuczpoYW5z', 'gid':'19'} // Take this out in production
      if (window.location.href.indexOf('localhost') == -1) {
        basicAuth = {}
      }
      return {
        ...headers,
        ...basicAuth,
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        };
    },
    configureOptions(options) {
      return {
        ...options,
        credentials:'same-origin'
         };
    }
  };

   
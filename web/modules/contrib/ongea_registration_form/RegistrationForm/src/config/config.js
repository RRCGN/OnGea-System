import axios from 'axios';



const rootElem = document.getElementById('ongea_activity_signupform');
export const config = {
  lang:rootElem.getAttribute('data-lang'),
  langPath: rootElem.getAttribute('data-langpath').replace(/\/\s*$/, "")+'/' + rootElem.getAttribute('data-lang') + '/translations.json',
  basePath: rootElem.getAttribute('data-basepath').replace(/\/\s*$/, ""),
  appLoginUrl: rootElem.getAttribute('data-appLoginUrl') ? rootElem.getAttribute('data-appLoginUrl').replace(/\/\s*$/, "") : null,
  appName: rootElem.getAttribute('data-appName'),
  activityId: rootElem.getAttribute('data-activityid'),
  sendingOrganisationId: rootElem.getAttribute('data-sendingorganisationId')
}

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
    }
  };

   
import axios from 'axios';

export const rootElem = document.getElementById('ongea_activity_app');
export const config = { 
  lang: rootElem.getAttribute('data-lang') || 'en',
  languages: (rootElem.getAttribute('data-languages').length>0)?rootElem.getAttribute('data-languages').split(','):['en'],
  baseUrl:rootElem.getAttribute('data-basepath').replace(/\/\s*$/, "")
}

var csrfToken;
axios.get(config.baseUrl+'/rest/session/token').then(response => {
  
  csrfToken = response.data;
}).catch(error => {
  console.log(error);
});




export const apiConfig = {
    baseUrl: config.baseUrl,
    fileUploadUrl: config.baseUrl+'/entity/file?_format=hal_json',
    credentials:'same-origin',
    configureHeaders(headers) {
      
      var basicAuth = {'Authorization' : 'Basic aGFuczpoYW5z', 'gid': '19'} // Take this out in production
      if (window.location.href.indexOf('localhost') === -1) {
        basicAuth = {}
      }
      
      return {
        ...headers,
        ...basicAuth,
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
        
         };
    }
  };

  
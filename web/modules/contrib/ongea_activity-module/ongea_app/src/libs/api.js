import { buildApi, get, post, put,destroy } from 'redux-bees';
import { apiConfig } from '../config/config';


// TODO: GET CONTENT TYPES FROM CONTENT-TYPES
//const ContentTypeNames = Object.keys(ContentTypes);

const ContentTypes = ['Project','Organisation','Place','Announcement','Activity', 'Profile', 'Mobility','ActivitiesForm', 'Travel', 'Event','Participant','Channel', 'Stay']
function getEndpoints() {
  
  let returnObj = {}; 
	for(var contentType of ContentTypes){

    let multi=(contentType.slice(-1)==='y')?(contentType.slice(0,-1)+'ies'):(contentType+'s');

    if(contentType === "ActivitiesForm"){
      multi=contentType;
    }else if(contentType === "Stay"){
      multi = "Stays";
    }

    let multiLower=multi.toLowerCase();
    returnObj['getEntire'+multi]={ method: get, path: '/'+multiLower };
    returnObj['get'+multi]={ method: get, path: '/'+multiLower};
    returnObj['get'+contentType]={ method: get, path: '/'+multiLower+'/:id/?_format=json' };
    returnObj['update'+contentType]={ method: put, path: '/'+multiLower+'/:id/?_format=json' };
    returnObj['create'+contentType]={ method: post, path: '/'+multiLower+'/?_format=json' };
    returnObj['delete'+contentType]={ method: destroy, path: '/'+multiLower+'/:id/?_format=json'};

    
  }

  // GET LIST
  returnObj['getList'] = { method: get, path: '/lists/:id/?_format=json' }

  return returnObj;
}
const apiEndpoints = getEndpoints();

export default buildApi(apiEndpoints, apiConfig);
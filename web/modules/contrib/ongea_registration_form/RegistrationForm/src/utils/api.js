import { buildApi, get, post, put,destroy } from 'redux-bees';
import { apiConfig } from '../config/config';



function getEndpoints() {
  
  let returnObj = {}; 

  returnObj['getOptionalFields'] = { method: get, path: '/signup/:id/?_format=json' };

  //GET activity
  returnObj['getActivity'] = { method: get, path: '/activities/:id/?_format=json' };

  // GET LIST
  returnObj['getList'] = { method: get, path: '/lists/:id/?_format=json' };

  //GET Organisations
  returnObj['getOrganisations'] = { method: get, path: '/organisations/?_format=json&scope=small&activityId=:id' };

//submit SignUp Form
  returnObj['submitForm'] = { method: put, path: '/signup/:id/?_format=json' };





  return returnObj;
}
const apiEndpoints = getEndpoints();

export default buildApi(apiEndpoints, apiConfig);
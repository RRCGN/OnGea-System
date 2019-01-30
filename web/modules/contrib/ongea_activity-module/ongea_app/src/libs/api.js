import { buildApi, get, post, put,destroy } from 'redux-bees';
import { apiConfig} from '../config/config';


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
    returnObj['getEntire'+multi]={ method: get, path: '/api/v2'+'/'+multiLower };
    returnObj['get'+multi]={ method: get, path: '/api/v2'+'/'+multiLower};
    returnObj['get'+contentType]={ method: get, path: '/api/v2'+'/'+multiLower+'/:id/' };
    returnObj['update'+contentType]={ method: put, path: '/api/v2'+'/'+multiLower+'/:id/' };
    returnObj['create'+contentType]={ method: post, path: '/api/v2'+'/'+multiLower+'/' };
    returnObj['delete'+contentType]={ method: destroy, path: '/api/v2'+'/'+multiLower+'/:id/'};

    
  }

  // GET LIST
  returnObj['getList'] = { method: get, path: '/api/v2'+'/lists/:id/' };

  returnObj['getCurrentUser'] = { method: get, path: '/en/api/v2'+'/currentuser/' };

  //only for stays
  returnObj['createMultiStays'] = { method: post, path: '/api/v2'+'/stayscol/' };


  return returnObj;
}

const apiEndpoints = getEndpoints();


const api = buildApi(apiEndpoints, apiConfig);
export default api; 



export const getCurrentUser= ()=>{

    return api.getCurrentUser().then((currentUser)=>{
          var user = currentUser.body;
          var roles = {};
          if(currentUser.body && currentUser.body.role){
            const role = user.role;
            if(role['ongea_org_group-org_admin'] && role['ongea_org_group-org_admin'].status===true){
              roles.org_admin = true;
            }
            if(role['ongea_org_group-activitie_admin'] && role['ongea_org_group-activitie_admin'].status===true){
               roles.act_admin = true;
            }
            if(role['ongea_org_group-sender'] && role['ongea_org_group-sender'].status===true){
               roles.sender = true;
            }
            if(role['ongea_org_group-member'] && role['ongea_org_group-member'].status===true){
               roles.member = true;
            }
            if(role['ongea_org_group-contributor'] && role['ongea_org_group-contributor'].status===true){
               roles.contributor = true;
            }
            if(role['ongea_org_group-editor'] && role['ongea_org_group-editor'].status===true){
               roles.editor = true;
            }

          }
          //delete user.role;

          user.roles = roles;
          return user;


      }); 

}


export const getParams=(context, contentType, props)=>{

  const language = props.i18n && props.i18n.language ? props.i18n.language : 'en';
    var params = {_format:'json'};

    if(context === 'getSingleForForms'){
        params.lan = language;
    }


    else if(context === 'listView'){
      params.lan = language;
      params.scope='small';
      if(contentType.id === "activities" || contentType.id==='mobilities' || contentType.id==='exports' || contentType.id==='announcements'){
        params.web=true;
      }
    }


    else if(context === 'referenceView'){
        if(props.contentType.id === 'projects' && props.referenceContentType && props.referenceContentType.id==='activities'){
          params.web=true;
        }

        if(props.contentType.id === 'activities'){
          params.activity = true;

          if(contentType.id === 'events' || contentType.id === 'places'){
            const activityId = props.match.params.id;
            params.activityId = activityId;
          }
        }else if(props.contentType.id === 'mobilities'){
            if(contentType.id === 'travels'){
            const activityId = props.match.params.parentId;
            params.activityId = activityId;
          }
        }
    }

    else if(context === 'selectsInForms'){
        if(props.contentType.id === 'mobilities' && (contentType.id === 'organisations')){
          
           const activityId = props.match.params.parentId;
           params.mobility = true;
           params.activityId = activityId;
           params.scope = 'small';
           params.lan = language;
        }
        else if(props.isReference && props.parentOfReference==='mobilities' && props.contentType.id === 'travels' && (contentType.id === 'places' || contentType.id === 'organisations')){
          
          const activityId = props.activityId;
           params.mobility = true;
           params.activityId = activityId;
           params.scope = 'small';
           params.lan = language;

        }else if((props.contentType.id === 'activities' && contentType.id === 'projects') && (props.match && props.match.params.id !== 'new')){
          const activityId = props.match.params.id;
          params.activity = activityId;
          params.scope = 'small';
          params.lan = language;
        }

        else if(props.contentType.id === 'activities' && (contentType.id === 'events' || contentType.id === 'places')){
          const activityId = props.match.params.id;
          params.activityId = activityId;
          params.scope = 'small';
          params.lan = language;
        }
        else if(props.parentOfReference==='activities' && props.isReference && (contentType.id === 'events' || contentType.id === 'places' || contentType.id==='travels')){
          const activityId = props.parentId;
          if(contentType.id!=='events'){
            params.activityId = activityId;
          }
          params.scope = 'small';
          params.lan = language;
        }
        else if(props.contentType.id === 'announcements' && contentType.id==='activities'){
         
          params.lan = language;
          params.web=true;
        }
    }
    

    return params;

}
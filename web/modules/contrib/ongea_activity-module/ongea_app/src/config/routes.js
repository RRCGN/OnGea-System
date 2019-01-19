import Dashboard from '../components/Dashboard/Dashboard';

//import ProjectsList from "../components/Projects/__ProjectsList";
import Project from '../components/Projects/Project';
import Projects from '../components/Projects/Projects';

import Activity from '../components/Activities/Activity';
import Activities from '../components/Activities/Activities';
import {Basic as ActivityBasic} from '../components/Activities/Forms/Basic';
import {OnlineSignup as ActivityOnlineSignup} from '../components/Activities/Forms/OnlineSignup';
import {Organisations as ActivityOrganisations} from '../components/Activities/Forms/Organisations';
import {Places as ActivityPlaces} from '../components/Activities/Forms/Places';
import {Schedule as ActivitySchedule} from '../components/Activities/Forms/Schedule';
import {Travels as ActivityTravels} from '../components/Activities/Forms/Travels';
//import ActivitiesList from '../components/Activities/ActivitiesList';

import Mobility from '../components/Mobilities/Mobility';
import Mobilities from '../components/Mobilities/Mobilities';

import {Basic as MobilityBasic} from '../components/Mobilities/Forms/Basic';
import {Profile as MobilityProfile} from '../components/Mobilities/Forms/Profile';
import {Erasmus as MobilityErasmus} from '../components/Mobilities/Forms/Erasmus';
import {Travels as MobilityTravels} from '../components/Mobilities/Forms/Travels';
import {Schedule as MobilitySchedule} from '../components/Mobilities/Forms/Schedule';


import {Basic as ProjectBasic} from '../components/Projects/Forms/Basic';
import {Funding as ProjectFunding} from '../components/Projects/Forms/Funding';
import {Organisations as ProjectOrganisations} from '../components/Projects/Forms/Organisations';
import {Activities as ProjectActivities} from '../components/Projects/Forms/Activities';
import Playground from '../components/Playground/Playground';


import Announcements from '../components/Announcements/Announcements';
import Announcement from '../components/Announcements/Announcement';
import {NewAnnouncement} from '../components/Announcements/NewAnnouncement';


import Organisation from '../components/Organisations/Organisation';
import Organisations from '../components/Organisations/Organisations';
import {Basic as OrganisationBasic} from '../components/Organisations/Forms/Basic';

import {Basic as PlaceBasic} from '../components/Places/Forms/Basic';

import {Basic as TravelBasic} from '../components/Travels/Forms/Basic';

import {Basic as EventBasic} from '../components/Events/Forms/Basic';

import Profile from '../components/Profiles/Profile';
import Profiles from '../components/Profiles/Profiles';
import {Basic as ProfileBasic} from '../components/Profiles/Forms/Basic';

import ListView from '../components/_Views/ListView';
//import DetailView from '../components/_Views/ListView';
import Mobilities_ChooseActivity from '../components/Mobilities/Mobilities_ChooseActivity';
import MobilitiesListView from '../components/Mobilities/MobilitiesListView';

import Exports_ChooseActivity from '../components/Exports/Exports_ChooseActivity';
import Exports from '../components/Exports/Exports';
import ExportContentView from '../components/Exports/ExportContentView';

import Export1_accommodationList from '../components/Exports/ExportLists/Export1_accommodationList';
import Export2_listOfParticipants from '../components/Exports/ExportLists/Export2_listOfParticipants';
import Export3_forErasmusMobilityTool from '../components/Exports/ExportLists/Export3_forErasmusMobilityTool';
import Export4_forYouthpassCertificates from '../components/Exports/ExportLists/Export4_forYouthpassCertificates';
import Export5_mealsList from '../components/Exports/ExportLists/Export5_mealsList';
import Export6_roomingList from '../components/Exports/ExportLists/Export6_roomingList';
import Export7_scheduleList from '../components/Exports/ExportLists/Export7_scheduleList';


const regexNumber = '[0-9]*';
const NewOrId = 'new|' + regexNumber;
const TabName = ':tab?';

export const getCleanPath = (path) => {
  let p = path;

  p=path
  .replace(':id','new')
  .replace('(' + regexNumber + ')', '')
  .replace(TabName, '')
  .replace('(' + NewOrId + ')', '');

  return p;
};


export const getPath = (path, id, parentId) => {
  //console.log(path,id,parentId);
  let p = path;

  
  if(id!==undefined && parentId!==undefined){
    if(id==='new'){
      if(parentId!==undefined){
        p=path.replace(':parentId', parentId);
      }
      return p;
    }
    p=path.replace(':parentId', parentId).replace(':id', id);
  }
  else{
    if(id!==undefined){
      p=path.replace(':id', id);
    }
    if(parentId!==undefined){
      p=path.replace(':parentId', parentId);
    }
  }

  return p;
};

//let getSubRoute = name => {return {hallo:'hallo'}};


export const routes = {
  mainMenu: [
    {
      title:"dashboard",
      path: "/",
      component: Dashboard,
      exact: true
    }, {
      title:"project",
      path: "/projects",
      component: Projects,
      routes: [
        {
          title:"new_project",
          path: "/projects/new",
          component: Projects
        }
      ]
    },{
      title:"activity",
      path: "/activities",
      component: Activities,
      routes: [
        {
          title:"new_activity",
          path: "/activities/new",
          component: Activities
        }
      ]
    },{
      title:"mobility",
      path: "/mobilities/:parentId(" + regexNumber + ")(/|):id(" + NewOrId + ")",
      component: Mobilities,
      exact: false,
      visible: false
    },{
      title:"mobility",
      path: "/mobilities",
      component: Mobilities_ChooseActivity,
      exact: false
    },{
      title:"organisation",
      path: "/organisations",
      component: Organisations,
      routes: [
        {
          title:"new_organisation",
          path: "/organisations/new",
          component: Organisations
        }
      ]
    },{
      title:"announcement",
      path: "/announcements",
      component: Announcements,
    },{
      title:"profile",
      path: "/profiles",
      component: Profiles,
    },{
      title:"export",
      path: "/exports/:id(" + regexNumber + ")",
      component: ExportContentView,
      exact: false,
      visible: false
    }, {
      title:"export",
      path: "/exports",
      component: Exports_ChooseActivity,
    }, {
      visible: false,
      title:"playground",
      path: "/playground",
      component: Playground,
    }
  ],
  projects: [
    {
      id:'edit',
      label: "Edit project",
      path: "/projects/:id(" + regexNumber + ")",
      component: Project, //DetailView -- not working
      exact: false,
      visible: false,
    }, 
    {
      id:'list',
      label: "myProjects",
      path: "/projects",
      component: ListView,
      exact: true
    }, 
    {
      id:'new',
      label: "new_project",
      path: "/projects/new/" + TabName,
      component: Project,
      exact: false
    },
  ],
  activities: [
    {
      id:'edit',
      label: "Edit activites",
      path: "/activities/:id(" + regexNumber + ")",
      component: Activity, 
      exact: false,
      visible: false,
    },
    {
      id:'list',
      label: "myActivities",
      path: "/activities",
      component: ListView,
      exact: true
    },
    {
      id:'new',
      label: "new_activity",
      path: "/activities/new/" + TabName,
      component: Activity,
      exact: false
    }
  ],
  mobilities: [
    {
      id:'edit',
      label: "Edit mobilities",
      path: "/mobilities/:parentId(" + regexNumber + ")/:id(" + regexNumber + ")",
      component: Mobility, 
      exact: false,
      visible: false,
    },
    {
      id:'list',
      label: "myMobilities",
      path: "/mobilities/:parentId(" + regexNumber + ")",
      //component: ListView
      component: MobilitiesListView
    }/*,
    {
      id:'new',
      label: "new_mobility",
      path: "/mobilities/:parentId(" + regexNumber + ")/new/" + TabName,
      component: Mobility,
      exact: false
    }*/
  ],
    announcements: [
    {
      id:'list',
      label: "my_announcements",
      path: "/announcements/",
      component: ListView, 
      exact: false
    },
    {
      id:'new',
      label: "new_announcement",
      path: "/announcements/new/" + TabName,
      component: Announcement,
      exact: false
    }
  ],organisations: [
    {
      id:'edit',
      label: "Edit organisation",
      path: "/organisations/:id(" + regexNumber + ")",
      component: Organisation, //DetailView -- not working
      exact: false,
      visible: false,
    }, {
      id:'list',
      label: "my_organisations",
      path: "/organisations",
      component: ListView,
      exact: true
    }, {
      id:'new',
      label: "new_organisation",
      path: "/organisations/new/" + TabName,
      component: Organisation,
      exact: false
    },
  ],
  profiles: [
    {
      id:'edit',
      label: "Edit profile",
      path: "/profiles/:id(" + regexNumber + ")",
      component: Profile, //DetailView -- not working
      exact: false,
      visible: false,
    }, {
      id:'list',
      label: "profile_plural",
      path: "/profiles",
      component: ListView,
      exact: true
    }, {
      id:'new',
      label: "new_profile",
      path: "/profiles/new/" + TabName,
      component: Profile,
      exact: false
    }
  ],
  exports: [
    {
      label: "myExports",
      path: "/exports/:id(" + regexNumber + ")",
      component: Exports
    }
  ],
  projectsDetail: [
    {
      id: "basic",
      label: "general_project_information",
      path: "/projects/:id(" + NewOrId + ")",
      component: ProjectBasic,
      exact: true
    }, {
      id: "funding",
      label: "funding_information",
      path: "/projects/:id(" + NewOrId + ")/funding-information",
      component: ProjectFunding
    },
    {
      id: "organisations",
      label: "organisations_involved_project",
      path: "/projects/:id(" + NewOrId + ")/organisations",
      component: ProjectOrganisations
    },
    {
      id: "activities",
      label: "activities_involved_project",
      path: "/projects/:id(" + NewOrId + ")/activities",
      component: ProjectActivities
    }
  ],
  activitiesDetail: [
    {
      id: "basic",
      label: "general_activity_information",
      path: "/activities/:id(" + NewOrId + ")",
      component: ActivityBasic,
      exact: true
    }, {
      id: "onlineSignup",
      label: "online_sign_up_form",
      path: "/activities/:id(" + NewOrId + ")/online-signup-form",
      component: ActivityOnlineSignup
    },
    {
      id: "organisations",
      label: "organisations_involved_activity",
      path: "/activities/:id(" + NewOrId + ")/organisations",
      component: ActivityOrganisations
    },
    {
      id: "places",
      label: "places_involved_activity",
      path: "/activities/:id(" + NewOrId + ")/places",
      component: ActivityPlaces
    },
    {
      id: "schedule",
      label: "schedule",
      path: "/activities/:id(" + NewOrId + ")/schedule",
      component: ActivitySchedule
    },
    {
      id: "travels",
      label: "travel_plural",
      path: "/activities/:id(" + NewOrId + ")/travels",
      component: ActivityTravels
    }
  ],
  mobilitiesDetail: [
    {
      id: "basic",
      label: "mobility_basic_settings",
      path: "/mobilities/:parentId(" + regexNumber + ")/:id(" + NewOrId + ")",
      component: MobilityBasic
    },
    {
      id: "profile",
      label: "profile_data",
      path: "/mobilities/:parentId(" + regexNumber + ")/:id(" + NewOrId + ")/profile",
      component: MobilityProfile
    },
    {
      id: "travel",
      label: "travel_plural",
      path: "/mobilities/:parentId(" + regexNumber + ")/:id(" + NewOrId + ")/travels",
      component: MobilityTravels
    },
    {
      id: "erasmus",
      label: "erasmus_plus",
      path: "/mobilities/:parentId(" + regexNumber + ")/:id(" + NewOrId + ")/erasmus",
      component: MobilityErasmus
    },
    {
      id: "schedule",
      label: "schedule_stays",
      path: "/mobilities/:parentId(" + regexNumber + ")/:id(" + NewOrId + ")/schedule",
      component: MobilitySchedule
    }
  ],
  organisationsDetail: [
    {
      id: "basic",
      label: "general_organisation_information",
      path: "/organisations/:id(" + NewOrId + ")",
      component: OrganisationBasic,
      exact: true
    }
  ],
  profilesDetail: [
    {
      id: "basic",
      label: "Basic Information",
      path: "/profiles/:id(" + NewOrId + ")",
      component: ProfileBasic,
      exact: true
    }
  ],
  placesDetail: [
    {
      id: "basic",
      label: "place",
      path: "/place/:id(" + NewOrId + ")",
      component: PlaceBasic,
      exact: true
    }
  ],
  travelsDetail: [
    {
      id: "basic",
      label: "travel",
      path: "/travel/:id(" + NewOrId + ")",
      component: TravelBasic,
      exact: true
    }
  ],
  eventsDetail: [
    {
      id: "basic",
      label: "Event",
      path: "/event/:id(" + NewOrId + ")",
      component: EventBasic,
      exact: true
    }
  ],
  announcementsDetail: [
    {
      id: "newAnnouncement",
      label: "new_announcement",
      path: "/announcements/:id(" + NewOrId + ")",
      component: NewAnnouncement,
      exact: true
    }
  ],
  exportsDetail: [
    /*{
      id: "export1",
      label: "accomodation_list",
      path: "/exports/:id(" + regexNumber + ")/export1",
      component: Export1_accommodationList
    },*/
    {
      id: "export2",
      label: "signature_list",
      path: "/exports/:id(" + regexNumber + ")",
      component: Export2_listOfParticipants
    },
    {
      id: "export3",
      label: "mobility_tool_list",
      path: "/exports/:id(" + regexNumber + ")/export3",
      component: Export3_forErasmusMobilityTool
    },
    {
      id: "export4",
      label: "youthpass_list",
      path: "/exports/:id(" + regexNumber + ")/export4",
      component: Export4_forYouthpassCertificates
    },
    /*{
      id: "export5",
      label: "meals_list",
      path: "/exports/:id(" + regexNumber + ")/export5",
      component: Export5_mealsList
    },
    {
      id: "export6",
      label: "rooming_list",
      path: "/exports/:id(" + regexNumber + ")/export6",
      component: Export6_roomingList
    },*/
    {
      id: "export7",
      label: "schedule_list",
      path: "/exports/:id(" + regexNumber + ")/export7",
      component: Export7_scheduleList
    }
  ],

}



/*
route -> path
      -> component
      -> contentType  - label
                      - id
      -> hasDetail    - generate edit, add, list
      -> detail       - id
                      - label
                            
*/
      

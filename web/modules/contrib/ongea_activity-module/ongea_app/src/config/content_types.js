import api from '../libs/api';
import * as Yup from 'yup';
import {  getElapsedTime, getDateForObj} from '../libs/utils/dateHelpers';


export const ReferenceTypes = {
    BOOLEAN: {editComponent: 'checkbox'},
    REFERENCE: {editComponent: 'select'},
    STRING: {editComponent: 'select'}
}


Yup.addMethod(Yup.string, 'compareToStart', function(startDateRef,startTimeRef,endDateRef, message) {
 
    
        return this.test({
            name: 'compareToStart',
            message: message, 
            test: function (value) {
              var startDate = this.resolve(startDateRef);
              var startTime = this.resolve(startTimeRef);
              var endDate = this.resolve(endDateRef);
              var endTime = value;
              if(startTime){
                  startTime = startTime.split(':');
                  startDate.setHours(startTime[0]);
                  startDate.setMinutes(startTime[1]);
              }
              if(endTime){
                  endTime = endTime.split(':');
                  endDate.setHours(endTime[0]);
                  endDate.setMinutes(endTime[1]);
              }
              
              
              return startDate < endDate;
            }
          });

           
      });


Yup.addMethod(Yup.string, 'isRepeatValid', function(startDateRef,startTimeRef,endDateRef,endTimeRef,switchedOnRef ,message) {
 
    
        return this.test({
            name: 'isRepeatValid',
            message: message, 
            test: function (value) {
              var startDate = this.resolve(startDateRef);
              var startTime = this.resolve(startTimeRef);
              var endDate = this.resolve(endDateRef);
              var endTime = this.resolve(endTimeRef);
              var switchedOn = this.resolve(switchedOnRef);
              var repeat = value;
              var repeatMilliSec = null;
              var duration = null;

              if(startDate && startTime){
                  if(startTime){
                      startTime = startTime.split(':');
                      startDate.setHours(startTime[0]);
                      startDate.setMinutes(startTime[1]);
                  }else{
                    startDate.setHours(23);
                    startDate.setMinutes(59);
                  }
                  if(endTime){
                      endTime = endTime.split(':');
                      endDate.setHours(endTime[0]);
                      endDate.setMinutes(endTime[1]);
                  }else{
                      endDate.setHours(0);
                      endDate.setMinutes(0);      
                  }
                  duration = getElapsedTime(startDate,endDate);
                }
              switch(repeat) {
                    case 'hourly':
                        repeatMilliSec = 3600 *1000;
                        break;
                    case 'daily':
                        repeatMilliSec = 3600 * 24 * 1000;
                        break;
                    case 'weekly':
                        repeatMilliSec = 3600 * 24 * 7 * 1000;
                        break;
                    default:
                        repeatMilliSec = 3600 *1000;
                }


                
              
                if(repeatMilliSec && duration && switchedOn){
                    return duration < repeatMilliSec;
                }else{
                    return true;
                }
            }
          });

          
      });



const getParticipants=()=>{
    const api = ContentTypes.Profiles.api;
    const params = {_format:'json', scope:'small'};

    return api.get(params)
            .then((result) => {
              return result.body;
            })
            .catch((error) => {
              
            });
  }

Yup.addMethod(Yup.string, 'doesEmailExist', function(props, message) {
    

    
       
       return this.test({
            name: 'doesEmailExist',
            message: message, 
            test: function (value) {
                return getParticipants().then((participants)=>{
                    if(props.match && props.match.params.id!=='new'){
                        participants = participants.filter((it)=>(it.id !== parseInt(props.match.params.id,10)));
                    }
                    
                   const exists = participants.findIndex((it)=>(it.mail === value))!==-1;
                   
                   return !exists;

                }).catch((error)=>{console.error(error);});
                
                
                
               

            }
          });
          
      });



export const Lists =  {
    types:{
        foodOptions: "foodoptions",
        roomRequirements: "roomrequirement",
        gender: "gender",
        skillsAndInterests: "skillsandinterests",
        distanceBand: "distanceband",
        participantRole:"participantrole",
        participantStatus: "participantstatus",
        eventCategory:"eventcategory",
        showMy:"showmy",
        whoCanSee:"whocansee",
        signUpFormSettings:"signupformsetttings2",
        signUpFormFieldSettings:"signupformfieldsetttings",
        organisationRights: "organisationrights"
    },
    getDataAsync: async (listName) => {
        if(localStorage.getItem(listName)){
            try{
                let foundData = JSON.parse(localStorage.getItem(listName));
                return foundData;
            }catch(error){
                console.error(error);
            }
        }
        const params={_format:'json'};
        const response = await api.getList({id: listName, ...params});//await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.body;

        // IF DATA IS NOT IN THE CORRECT FORMAT like {value:VAL,label:LAB}
        let i=0;
        for(var item of data) {
            
            if(typeof item === 'string'){
                let val=item;
                data[i]={value:val,label:val}
            }
            i++;
        }
        localStorage.setItem(listName, JSON.stringify(data));
        
        return data;
    }
}

export const ContentTypes = 
    {
        Dashboard:{
            title: 'dashboard'
        },
        Exports:{
            title: 'export',
            id:'exports',
            api: {
                getEntire: api.getEntireActivities, //scope large
                get: api.getActivities,                 //scope small
                getSingle: api.getActivity,
                delete: api.deleteActivity,
                update: api.updateActivity,
                create: api.createActivity
            },
        },
        Channel:{
            title: 'channel',
            id: 'channels',
            api: {
                getEntire: api.getEntireChannels, //scope large
                get: api.getChannels
            }
        },
        Activities:{
            title: 'activity',
            id: 'activities', //id for route and reference
            columns: [
                { name: 'id', title: "id", isHidden:true, sortBy: "desc" },
                { name: 'title', title: "title", isPrimary:true },
                { name: 'dateFrom', title: "from_time",isDate:true },
                { name: 'dateTo', title: "to_time",isDate:true }
              ],
            api: {
                getEntire: api.getEntireActivities, //scope large
                get: api.getActivities,                 //scope small
                getSingle: api.getActivity,
                delete: api.deleteActivity,
                update: api.updateActivity,
                create: api.createActivity
            },
            validationSchema: ()=>({
                basic: Yup.object().shape({
                                            project: Yup.string()
                                                .required('choose_project')
                                                .nullable(),
                                            title: Yup.string()
                                                .nullable()
                                                .required('title_required'),
                                            dateFrom: Yup.date()
                                                .nullable()
                                                .required('startDate_required'),
                                            dateTo: Yup.date()
                                                .nullable()
                                                .required('departureDate_required')
                                                .min(Yup.ref('dateFrom'),'endDate_after_startDate'),


                                            })
            })
            
        },
        ActivitiesForm:{
            title: 'activitiesform',
            id: 'signUpForm', //id for route and reference
            api: {
                getEntire: api.getEntireActivitiesforms,
                get: api.getActivitiesforms,
                getSingle: api.getActivitiesForm,
                delete: api.deleteActivitiesForm,
                update: api.updateActivitiesForm,
                create: api.createActivitiesForm
            },
            validationSchema: ()=>({})
            
        },
        Mobilities:{
            title: 'mobility',
            id: 'mobilities', //id for route and reference
            columns: [
                { name: 'id', title: "id", sortBy:"desc" },
                { name: 'profile', title: "Participant",isNameAndImage:true,getData: (row) => { 

                    if(row && row.participant)
                        {
                            
                            return ({firstName:row.participant.firstname,
                                lastName:row.participant.lastname,
                                nickName:row.participant.nickname,
                                profilePicture:(row.participant.profilePicture)?row.participant.profilePicture[0]:[] || []});
                            //return ({firstName: row.participant.firstname})
                        }
                        else{
                            //return "NO-PROFILE"
                            return ({firstName: "[NO-PROFILE]"});
                        }
                    }
                },
                //{ name: '', title: "",  getData: (row) => {return (row.participant)?"TODO: Implement Image":"[NO-DATA]" } },
                //{ name: 'name', title: "name", isPrimary:true,  getData: (row) => {return (row.participant)?row.participant.name:"[NO-NAME]" } },
                { name: 'dateFrom', title: "from_time",isDate:true },
                { name: 'dateTo', title: "to_time",isDate:true },
                { name: 'participantRole', title: "mobility_role",referenceType: ReferenceTypes.REFERENCE,reference:Lists.types.participantRole,defaultValue: 'participant'},
                { name: 'participantStatus', title: "mobility_status", referenceType: ReferenceTypes.REFERENCE,reference:Lists.types.participantStatus,defaultValue: 'applicant'}
              ],
            api: {
                //get: api.getMobility,
                get: api.getActivity,
                getSingle: api.getMobility,
                //getSingle: api.getMobility,
                delete: api.deleteMobility,
                update: api.updateMobility,
                create: api.createMobility
            },
            validationSchema: ()=>({
                basic: Yup.object().shape({
                                            participant: Yup.string()
                                                .required('participant_required')
                                                .nullable(),
                                            participantRole: Yup.string()
                                                .required('participantRole_required')
                                                .nullable(),
                                            participantStatus: Yup.string()
                                                .required('participantStatus_required')
                                                .nullable(),
                                            dateFrom: Yup.date()
                                                .nullable()
                                                .required('startDate_required'),
                                            dateTo: Yup.date()
                                                .nullable()
                                                .min(Yup.ref('dateFrom'),'endDate_after_startDate'),


                                            })
            })
            
        },
        MobilitiesParticipant: {  
            id: 'mobilities'
        },
        Stays:{
            title: 'stay',
            id: 'stays', //id for route and reference
            columns: [

                { name: 'title', title: "title", isPrimary:true , getData: (row,t) => {
                    
                    if(row.eventDay && row.eventDay.length >0){
                            return row.eventDay[0].title;
                        }else if (row.event){
                            return row.event.title;
                        }
                }},
                { name: 'place', title: "Place" , getData: (row,t) => {
                    if(row.event && row.event.place){
                            return row.event.place.name;
                        }else{
                            return '';
                        }
                }},
                { name: 'startDate', title: "start", getData: (row,t) => {
                        var date = undefined;

                        if(row.eventDay && row.eventDay.length >0){

                            date = row.eventDay[0].date;

                        }else if (row.event && row.event.startDate){
                            date = row.event.startDate+' '+row.event.startTime;
                        }
                        
                        if(date){
                            return date;
                            //return getDate(dateObject)+'\n'+getTime(dateObject);
                        }else{
                            return '';
                        }
                    }},
                /*{ name: 'endDate', title: "end", getData: (row,t) => {
                        var date= undefined;

                        if(row.eventDay && row.eventDay.length >0){
                            const startDate = new Date(row.event.startDate+' '+row.event.startTime);
                            const endDate = new Date(row.event.endDate+' '+row.event.endTime);
                            const duration = getElapsedTime(startDate,endDate);
                            date = getEndTime(row.eventDay[0].date,duration);
                            date = getDateForObj(date)+' '+getTime(date);

                        }else if (row.event && row.event.endDate){
                            date = row.event.endDate+' '+row.event.endTime;
                        }
                         
                        if(date){
                            return date;
                        }else{
                            return '';
                        }
                    }},*/
                //{ name: 'roomNumber', title: "room",referenceType: ReferenceTypes.STRING, defaultValue:null},
                //{ name: 'roomNumber_disabled', title: "disabled",isHidden:true,referenceType: ReferenceTypes.BOOLEAN, defaultValue:true},
                //{ name: 'reducedPrice', title: "reduced",referenceType: ReferenceTypes.BOOLEAN,defaultValue:false},
                //{ name: 'reducedPrice_disabled', title: "disabled",isHidden:true,referenceType: ReferenceTypes.BOOLEAN, defaultValue:true},
                //{ name: 'mobilityIds', title: "Mobilities", getData:(row,t)=>{return row.mobilityIds && row.mobilityIds.length>0 ? row.mobilityIds.map((it)=>(it.id+', ')):'empty';}},
                { name: 'attendance', title: "attendance", referenceType: ReferenceTypes.BOOLEAN,defaultValue:false}



            ],
            api: {
                getEntire: api.getEntireStays,
                get: api.getStays,
                getSingle: api.getStay,
                delete: api.deleteStay,
                update: api.updateStay,
                create: api.createStay,
                createMulti: api.createMultiStays
            },
            validationSchema: ()=>({})
            
        },
        Travels:{
            title: 'travel',
            id: 'travels', //id for route and reference
            columns: [
                { name: 'title', title: "title", isPrimary:true },
                { name: 'departureDate', title: "Departure date", isDate:true},
                { name: 'arrivalDate', title: "Arrival date", isDate:true},
                /*{ name: 'arrivalFrom', title: "departure Date"},*/
                
                /*{ name: 'departureTo', title: "departure Date"},*/
              ],
            api: {
                getEntire: api.getEntireTravels,
                get: api.getTravels,
                getSingle: api.getTravel,
                delete: api.deleteTravel,
                update: api.updateTravel,
                create: api.createTravel
            },
            validationSchema: ()=>({
                basic: Yup.object().shape({
                                            title: Yup.string()
                                                .nullable()
                                                .required('title_required'),
                                            departureDate: Yup.date()
                                                .nullable()
                                                .required('departureDate_required'),
                                            arrivalDate: Yup.date()
                                                .nullable()
                                                .required('arrivalDate_required')
                                                
                                            


                                            })
            })
            
        },
        Organisations:{
            title: 'organisation',
            id: 'organisations', //id for route and reference
            isDeletable:false, 
            columns: [
                { name: 'id', title: "id", isHidden:true, sortBy: "desc" },
                { name: 'title', title: "title", isPrimary:true },
                { name: 'acronym', title: "Acronym"},
                { name: 'country', title: "Country", getData: (row,t) => {return row.country ? t(row.country) : ''}},
                { name: 'town', title: "City"},
               
              ],
            api: {
                
                getEntire: api.getEntireOrganisations,
                get: api.getOrganisations,
                getSingle: api.getOrganisation,
                delete: api.deleteOrganisation,
                update: api.updateOrganisation,
                create: api.createOrganisation
            },
            validationSchema: ()=>({
                basic: Yup.object().shape({
                                            title: Yup.string()
                                                .nullable()
                                                .required('title_required'),
                                            mail: Yup.string()
                                                .nullable()
                                                .email('email_valid'),
                                            website: Yup.string()
                                                .nullable()
                                                .url("url_valid"),


                                            })
            })
            
        },
        ActivityOrganisations: {            
            extendColumns: [
                //{ name: 'organisationRights', title: "Rights", referenceType: ReferenceTypes.REFERENCE,reference:Lists.types.organisationRights,defaultValue: 2 },
                { name: 'isHost', title: "host_org", referenceType: ReferenceTypes.BOOLEAN,defaultValue:false, limit:1  }
              ],
              removeColumns: ['country','town']
        },
        ActivityMobilities: {   
            id: 'mobilities',
            /*extendColumns: [
                { name: 'mobilities', title: "mobilities", getData: (row,t) => {
                    
                    return (row.mobilities)?row.mobilities.filter(it=>it!==null).length:0
                } 
                },
            ],*/
            api: {
                getSingle: api.getActivity,
                get: api.getEntireActivities
            }
        },
        ActivityExports: {   
            id: 'exports'
        },
        Places:{
            title: 'place',
            id: 'places', //id for route and reference
            columns: [
                { name: 'name', title: "name", isPrimary:true },
                { name: 'street', title: "Street address"},
                { name: 'town', title: "ongea_activity_place_town", getData: (row,t) => {
                        if(row.town && row.postcode){
                            return row.town+ ' ('+row.postcode+')';
                        }else if(row.town && !row.postcode){
                            return row.town;
                        }else{
                            return '';
                        }
                    }},
                { name: 'country', title: "ongea_activity_place_country", getData: (row,t) => {return row.country ? t(row.country) : ''}},
              ],
            api: {
                getEntire: api.getEntirePlaces,
                get: api.getPlaces,
                getSingle: api.getPlace,
                delete: api.deletePlace,
                update: api.updatePlace,
                create: api.createPlace
            },
            validationSchema: ()=>({
                basic: Yup.object().shape({
                                            name: Yup.string()
                                                .nullable()
                                                .required('placeName_required')
                                          
                                            })
            })
            
        },
        Events:{
            title: 'event',
            id: 'events', //id for route and reference
            columns: [
                { name: 'title', title: "title", isPrimary:true },
                { name: 'startDate', title: "Start time", isDateTime:true, getData: (row,t) => {
                        var timeStamp = null;
                        if(row.startDate){
                            timeStamp = new Date(row.startDate);
                        }
                        if(row.startDate && row.startTime){
                            timeStamp = new Date(getDateForObj(row.startDate)+ ' '+ row.startTime);
                        }

                        return timeStamp.getTime();
                    }
                    },
                { name: 'place', title: "Place", getData: (row,t) => {return (row.place)?row.place.name : '' }}
              ],
            api: {
                
                getEntire: api.getEntireEvents,
                get: api.getEvents,
                getSingle: api.getEvent,
                delete: api.deleteEvent,
                update: api.updateEvent,
                create: api.createEvent
            },
            validationSchema: ()=>({
                basic: Yup.object().shape({
                                            category: Yup.string()
                                                .required('category_required')
                                                .nullable(),
                                            title: Yup.string()
                                                .nullable()
                                                .required('title_required'),
                                            startDate: Yup.date()
                                                .nullable()
                                                .required('startDate_required'),
                                            startTime: Yup.string()
                                                .nullable()
                                                .required('startTime_required'),
                                            endDate: Yup.date()
                                                .nullable()
                                                .min(Yup.ref('startDate'),'endTime_after_startTime'),
                                            endTime: Yup.string()
                                                .nullable()
                                                .compareToStart(Yup.ref('startDate'),Yup.ref('startTime'),Yup.ref('endDate'),'endTime_after_startTime'),
                                            repeatCycle: Yup.string()                                           
                                                .isRepeatValid(Yup.ref('startDate'),Yup.ref('startTime'),Yup.ref('endDate'),Yup.ref('endTime'),Yup.ref('repeatEvent'),'repeatCycle_valid'),

                                            })
            })
            
        },
        Project:{
            title: 'project',
            id: 'projects', //id for route and reference
            columns: [
                { name: 'id', title: "id", isHidden:true, sortBy: "desc" },
                { name: 'title', title: "title", isPrimary:true },
                { name: 'dateFrom', title: "from_time",isDate:true },
                { name: 'dateTo', title: "to_time",isDate:true },
                { name: 'grantAgreementNumber', title: "grant_agreement_number" },
                { name: 'activities', title: "activity_plural", getData: (row,t) => {
                    let returnData = 0;
                    if(row && row.activities)returnData=row.activities.length;
                    return returnData;
                }}
              ],
            api: {
                getEntire: api.getEntireProjects,
                get: api.getProjects,
                getSingle: api.getProject,
                delete: api.deleteProject,
                update: api.updateProject,
                create: api.createProject
            },
            validationSchema: ()=>({
                basic: Yup.object().shape({
                                            title: Yup.string()
                                                .required('title_required'),
                                            dateFrom: Yup.date()
                                                .required('startDate_required'),
                                            dateTo: Yup.date()
                                                .min(Yup.ref('dateFrom'),'endDate_after_startDate'),

                                            }),
                funding: false,
                organisations: false,
                activities: false
            })
        },
        Profiles:{
            title: 'profile',
            id: 'profiles', //id for route and reference
            columns: [
                { name: 'id', title: "id", isHidden:true, sortBy: "desc" },
                { name: 'profile', title: "Name",isNameAndImage:true,getData: (row) => { return ({firstName:row.firstname,lastName:row.lastname,nickName:row.nickname,profilePicture:row.profilePicture[0] || []})}},
                { name: 'name', title: "Name", isHidden:true, getData: (row,t) => {return row ? row.firstname+' '+row.lastname+' '+row.nickname : ''} }, //just to enable name search in datatable
                { name: 'mail', title: "E-Mail", isEmail:true },
                { name: 'country', title: "Country", getData: (row,t) => {return row.country ? t(row.country) : ''} }
              ],
            api: {
                get: api.getEntireParticipants,
                getSingle: api.getParticipant,
                delete: api.deleteParticipant,
                update: api.updateParticipant,
                create: api.createParticipant
            },
            validationSchema: (props)=>{
               
                return {basic: Yup.object().shape({
                                    firstname: Yup.string()
                                        .nullable()
                                        .required('firstName_required'),
                                    lastname: Yup.string()
                                        .nullable()
                                        .required('lastName_required'),
                                    birthDate: Yup.date()
                                        .nullable()
                                        .required('birthDate_required'),
                                    website: Yup.string()
                                        .nullable()
                                        .url("url_valid"), 
                                    linkToExample: Yup.string()
                                        .nullable()
                                        .url("url_valid"),
                                    mail: Yup.string()
                                    .nullable()
                                    .email('email_valid')
                                    .required('email_required')
                                    .doesEmailExist(props,'email_exists_profile')
                                    })};
                
            } 
                
            
        },
        Announcements:{
            title: 'announcement',
            id: 'announcements', //id for route and reference
            isEditable:false,
            columns: [
                { name: 'field_ongea_msg_sendtime_value', title: "Date/time", isRelativeDate:true, sortBy: 'desc' },
                //{ name: 'sender', title: "sent_by"},
                { name: 'sentTo', title: "sent_to", getData: (row,t) => {
                    let returnData = [];
                    if(row.field_ongea_msg_to_parts_value===true)returnData.push(t('Participants'));
                    if(row.field_field_ongea_msg_to_grouple_value===true)returnData.push(t('Group Leaders'));
                    if(row.field_ongea_msg_to_staff_value===true)returnData.push(t('Staff'));
                    if(row.field_ongea_msg_applicants_value===true)returnData.push(t('Applicants'));
                    if(returnData.length===0)returnData.push(t('None'));
                    return returnData.join(", ");
                }},
                //{ name: 'sendInActivity', title: "activity"},
                { name: 'field_ongea_message_value', title: "announcement" }
              ],
            api: {
                getEntire: api.getEntireAnnouncements,
                get: api.getAnnouncements,
                getSingle: api.getAnnouncement,
                delete: api.deleteAnnouncement,
                update: api.updateAnnouncement,
                create: api.createAnnouncement
            },
            validationSchema: ()=>({})
            
        }
    }

    //export const ContentTypes = translate("translations")(ContentTypesBase);


    export const extendReferenceContentType = (origContentType,extendContentType) => {

        var overwriteKeys = Object.assign({}, extendContentType); 

        const extendReferenceContentType = Object.assign(extendContentType, origContentType);

        const getIndex = (col) => extendReferenceContentType.columns.findIndex((it)=>it.name===col);
        
        if(extendContentType.extendColumns){
            extendReferenceContentType.columns = origContentType.columns.concat(extendContentType.extendColumns);
        }
        else{
            extendReferenceContentType.columns = origContentType.columns;
        }
        
        
        for (var key in overwriteKeys){
            if (typeof overwriteKeys[key] !== 'function' && key!=='extendColumns') {
                extendReferenceContentType[key]=overwriteKeys[key];
            }
        }

        // LOOP THROUGH REMOVECOLUMNS AND DELETE UNNESSEARY COLS
        if(extendContentType && extendContentType.removeColumns){
            for(var col of extendContentType.removeColumns){
                
                const columnIndex = getIndex(col);
                if(columnIndex !== -1){
                    extendReferenceContentType.columns.splice(columnIndex,1);
                }
                
            }
        }
        
        return extendReferenceContentType;
    }
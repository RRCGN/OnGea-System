import api from '../libs/api';
import * as Yup from 'yup';
import {getDate, getTime, getElapsedTime, getEndTime} from '../libs/utils/dateHelpers';


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

        const response = await api.getList({id: listName});//await fetch('https://jsonplaceholder.typicode.com/users');
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
    }/*,
    getData: function(listName) {
        
        if(localStorage.getItem(listName)){
            try{
                let foundData = JSON.parse(localStorage.getItem(listName));
                return foundData;
            }catch(error){
                console.error(error);
            }
            
        }
      
        api.getList({id: listName})
  .then((result) => {
    localStorage.setItem(listName, JSON.stringify(result.body));
    return result.body;
  })
  .catch((error) => {
    
    console.error(error);
  });
  return [];
        
        
    }*/
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
            validationSchema: {
                basic: Yup.object().shape({
                                            project: Yup.string()
                                                .required('Please choose a Project.')
                                                .nullable(),
                                            title: Yup.string()
                                                .nullable()
                                                .required('Title is required.'),
                                            dateFrom: Yup.date()
                                                .nullable()
                                                .required('Start date is required.'),
                                            dateTo: Yup.date()
                                                .nullable()
                                                .min(Yup.ref('dateFrom'),'End date should be after start date.'),


                                            })
            }
            
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
            validationSchema: {}
            
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
                { name: 'participantRole', title: "participantRole",referenceType: ReferenceTypes.REFERENCE,reference:Lists.types.participantRole,defaultValue: 'participant'},
                { name: 'participantStatus', title: "participantStatus", referenceType: ReferenceTypes.REFERENCE,reference:Lists.types.participantStatus,defaultValue: 'applicant'}
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
            validationSchema: {
                basic: Yup.object().shape({
                                            participant: Yup.string()
                                                .required('Please choose the participants role.')
                                                .nullable(),
                                            participantRole: Yup.string()
                                                .required('Please choose the participants role.')
                                                .nullable(),
                                            participantStatus: Yup.string()
                                                .required('Please choose the participants status.')
                                                .nullable(),
                                            dateFrom: Yup.date()
                                                .nullable()
                                                .required('Start date is required.'),
                                            dateTo: Yup.date()
                                                .nullable()
                                                .min(Yup.ref('dateFrom'),'End date should be after start date.'),


                                            })
            }
            
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
                { name: 'startDate', title: "Start", getData: (row,t) => {
                        var dateObject = undefined;

                        if(row.eventDay && row.eventDay.length >0){

                            dateObject = new Date(row.eventDay[0].date);

                        }else if (row.event && row.event.startDate){
                            dateObject = new Date(row.event.startDate+' '+row.event.startTime);
                        }
                        
                        if(!isNaN(dateObject)){
                            return getDate(dateObject)+'\n'+getTime(dateObject);
                        }else{
                            return '';
                        }
                    }},
                { name: 'endDate', title: "End", getData: (row,t) => {
                        var dateObject = undefined;

                        if(row.eventDay && row.eventDay.length >0){
                            const startDate = new Date(row.event.startDate+' '+row.event.startTime);
                            const endDate = new Date(row.event.endDate+' '+row.event.endTime);
                            const duration = getElapsedTime(startDate,endDate);
                            dateObject = getEndTime(new Date(row.eventDay[0].date),duration);

                        }else if (row.event && row.event.endDate){
                            dateObject = new Date(row.event.endDate+' '+row.event.endTime);
                        }
                         
                        if(!isNaN(dateObject)){
                            return getDate(dateObject)+'\n'+getTime(dateObject);
                        }else{
                            return '';
                        }
                    }},
                { name: 'roomNumber', title: "Room",referenceType: ReferenceTypes.STRING, defaultValue:null},
                { name: 'roomNumber_disabled', title: "disabled",isHidden:true,referenceType: ReferenceTypes.BOOLEAN, defaultValue:true},
                { name: 'reducedPrice', title: "Reduced price",referenceType: ReferenceTypes.BOOLEAN,defaultValue:false,getData: (row,t) => {
                        return (row.reducedPrice === '1' || row.reducedPrice === true) ? 'yes' : 'no';
                    }},
                { name: 'reducedPrice_disabled', title: "disabled",isHidden:true,referenceType: ReferenceTypes.BOOLEAN, defaultValue:true},
                { name: 'attendance', title: "attendance", referenceType: ReferenceTypes.BOOLEAN,defaultValue:false}



            ],
            api: {
                getEntire: api.getEntireStays,
                get: api.getStays,
                getSingle: api.getStay,
                delete: api.deleteStay,
                update: api.updateStay,
                create: api.createStay
            },
            validationSchema: {}
            
        }/*,
        MobilitiesStays: {   
            id: 'mobilities',
            extendColumns: [
                
                { name: 'roomNumber', title: "Room"},
                //{ name: 'reducedPrice', title: "reduced Price",referenceType: ReferenceTypes.BOOLEAN,defaultValue:false},
                { name: 'attendance', title: "attendance", referenceType: ReferenceTypes.BOOLEAN,defaultValue:false}



            ],
            api: {
                get: api.getMobilities,
                getSingle: api.getMobility,
                //delete: api.deleteTravel,
                update: api.updateMobility,
                //create: api.createTravel
            }
        }*/,
        Travels:{
            title: 'travel',
            id: 'travels', //id for route and reference
            columns: [
                { name: 'title', title: "title", isPrimary:true },
                { name: 'arrivalDate', title: "arrival date", isDate:true},
                /*{ name: 'arrivalFrom', title: "departure Date"},*/
                { name: 'departureDate', title: "departure Date", isDate:true},
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
            validationSchema: {
                basic: Yup.object().shape({
                                            title: Yup.string()
                                                .nullable()
                                                .required('Title is required.')
                                            


                                            })
            }
            
        },
        Organisations:{
            title: 'organisation',
            id: 'organisations', //id for route and reference
            columns: [
                { name: 'id', title: "id", isHidden:true, sortBy: "desc" },
                { name: 'title', title: "title", isPrimary:true },
                { name: 'acronym', title: "Acronym"},
                { name: 'country', title: "Country"},
                { name: 'town', title: "City"},
                /*{ name: 'location', title: "Location", getData: (row,t) => {return row.country+", "+row.}},*/
              ],
            api: {
                
                getEntire: api.getEntireOrganisations,
                get: api.getOrganisations,
                getSingle: api.getOrganisation,
                delete: api.deleteOrganisation,
                update: api.updateOrganisation,
                create: api.createOrganisation
            },
            validationSchema: {
                basic: Yup.object().shape({
                                            title: Yup.string()
                                                .nullable()
                                                .required('Title is required.'),
                                            mail: Yup.string()
                                                .nullable()
                                                .email('This is not a valid e-mail address.'),
                                            website: Yup.string()
                                                .nullable()
                                                .url("This is not a valid url, use format http://... ."),


                                            })
            }
            
        },
        ActivityOrganisations: {            
            extendColumns: [
                //{ name: 'organisationRights', title: "Rights", referenceType: ReferenceTypes.REFERENCE,reference:Lists.types.organisationRights,defaultValue: 2 },
                { name: 'isHost', title: "Host", referenceType: ReferenceTypes.BOOLEAN,defaultValue:false, limit:1  }
              ],
              removeColumns: ['country','town']
        },
        ActivityMobilities: {   
            id: 'mobilities',
            extendColumns: [
                { name: 'mobilities', title: "mobilities", getData: (row,t) => {
                    
                    return (row.mobilities)?row.mobilities.filter(it=>it!==null).length:0
                } 
                },
            ],
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
                { name: 'description', title: "description"},
                { name: 'town', title: "town"},
                { name: 'country', title: "country"},
              ],
            api: {
                getEntire: api.getEntirePlaces,
                get: api.getPlaces,
                getSingle: api.getPlace,
                delete: api.deletePlace,
                update: api.updatePlace,
                create: api.createPlace
            },
            validationSchema: {
                basic: Yup.object().shape({
                                            name: Yup.string()
                                                .nullable()
                                                .required('Place name is required.')
                                          
                                            })
            }
            
        },
        Events:{
            title: 'event',
            id: 'events', //id for route and reference
            columns: [
                { name: 'title', title: "title", isPrimary:true },
                { name: 'startDate', title: "Start date", isDate:true},
                { name: 'endDate', title: "End Date", isDate:true},
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
            validationSchema: {
               /* basic: Yup.object().shape({
                                            category: Yup.string()
                                                .required('Please choose a category.')
                                                .nullable(),
                                            title: Yup.string()
                                                .nullable()
                                                .required('Title is required.'),
                                            startDate: Yup.date()
                                                .nullable()
                                                .required('Start date is required.'),
                                            startTime: Yup.string()
                                                .nullable()
                                                .required('Start time is required.'),
                                            endDate: Yup.date()
                                                .nullable()
                                                .min(Yup.ref('startDate'),'Please choose an end time, which is later than the start time.'),
                                            endTime: Yup.string()
                                                .nullable()
                                                .compareToStart(Yup.ref('startDate'),Yup.ref('startTime'),Yup.ref('endDate'),'End time should be later than start time.'),
                                                                                        


                                            })*/
            }
            
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
                { name: 'activities', title: "activities", getData: (row,t) => {
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
            validationSchema: {
                basic: Yup.object().shape({
                                            title: Yup.string()
                                                .required('Title is required.'),
                                            dateFrom: Yup.date()
                                                .required('Start date is required.'),
                                            dateTo: Yup.date()
                                                .min(Yup.ref('dateFrom'),'End date should be after start date.'),

                                            }),
                funding: Yup.object().shape({
                                             fundingText: Yup.string()
                                            }),
                organisations: false,
                activities: false
            }
        },
        Profiles:{
            title: 'profile',
            id: 'profiles', //id for route and reference
            columns: [
                { name: 'id', title: "id", isHidden:true, sortBy: "desc" },
                { name: 'profile', title: "Name",isNameAndImage:true,getData: (row) => { return ({firstName:row.firstname,lastName:row.lastname,nickName:row.nickname,profilePicture:row.profilePicture[0] || []})}},
                { name: 'mail', title: "E-Mail", isEmail:true },
                { name: 'country', title: "Country" }
              ],
            api: {
                get: api.getEntireParticipants,
                getSingle: api.getParticipant,
                delete: api.deleteParticipant,
                update: api.updateParticipant,
                create: api.createParticipant
            },
            validationSchema: {
                basic: Yup.object().shape({
                                            firstname: Yup.string()
                                                .required('First name is required.'),
                                            lastname: Yup.string()
                                                .required('Last name is required.'),
                                            gender: Yup.string()
                                                .required('Gender is required.')
                                                .nullable(),
                                            birthDate: Yup.date()
                                                .nullable()
                                                .required('Birth date is required.'),
                                            mail: Yup.string()
                                                .nullable()
                                                .email('This is not a valid e-mail address.')
                                                .required('Email is required.'),
                                            website: Yup.string()
                                                .nullable()
                                                .url("This is not a valid url, use format http://... ."),
                                            }),
                
            }
                
            
        }/*,
        Participants: {
            title: 'participant',
            id: 'participant', //id for route and reference
            columns: [
                { name: 'id', title: "id", isHidden:true, sortBy: "desc" },
                { name: 'profile', title: "Name",isNameAndImage:true,isPrimary:true,getData: (row) => { return ({firstName:row.firstname,lastName:row.lastname,nickName:row.nickname,profilePicture:row.profilePicture[0] || []})}},
                { name: 'mail', title: "E-Mail", isEmail:true },
                { name: 'country', title: "Country" }
              ],
            api: {
                get: api.getEntireParticipants,
                getSingle: api.getParticipant,
                delete: api.deleteParticipant,
                update: api.updateParticipant,
                create: api.createParticipant
            },
            validationSchema: {}
        }/*,
        Profiles:{
            title: 'profile',
            id: 'profiles', //id for route and reference
            columns: [
                { name: 'lastname', title: "Name", isPrimary:true },
                { name: 'firstname', title: "First name" },
                { name: 'mail', title: "E-Mail" },
                { name: 'country', title: "Country" }
              ],
            api: {
                get: api.getProfiles,
                getSingle: api.getProfile,
                delete: api.deleteProfile,
                update: api.updateProfile,
                create: api.createProfile
            },
            validationSchema: {}
                
            
        }*/,
        Announcements:{
            title: 'announcement',
            id: 'announcements', //id for route and reference
            isEditable:false,
            columns: [
                { name: 'field_ongea_msg_sendtime_value', title: "Date/Time", isRelativeDate:true, sortBy: 'desc' },
                //{ name: 'sender', title: "sent_by"},
                { name: 'sentTo', title: "sent_to", getData: (row,t) => {
                    console.log(row);
                    let returnData = [];
                    if(row.field_ongea_msg_to_parts_value===true)returnData.push(t('Participants'));
                    if(row.field_field_ongea_msg_to_grouple_value===true)returnData.push(t('Group Leaders'));
                    if(row.field_ongea_msg_to_staff_value===true)returnData.push(t('Staff'));
                    if(row.field_ongea_msg_applicants_value===true)returnData.push(t('Applicants'));
                    if(returnData.length===0)returnData.push(t('None'));
                    return returnData.join(", ");
                }},
                //{ name: 'sendInActivity', title: "activity"},
                { name: 'field_ongea_message_value', title: "message" }
              ],
            api: {
                getEntire: api.getEntireAnnouncements,
                get: api.getAnnouncements,
                getSingle: api.getAnnouncement,
                delete: api.deleteAnnouncement,
                update: api.updateAnnouncement,
                create: api.createAnnouncement
            },
            validationSchema: {}
            
        }
    }

    //export const ContentTypes = translate("translations")(ContentTypesBase);


    export const extendReferenceContentType = (origContentType,extendContentType) => {

        var overwriteKeys = Object.assign({}, extendContentType); 

        const extendReferenceContentType = Object.assign(extendContentType, origContentType);
        
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
                
                const columnIndex = extendReferenceContentType.columns.findIndex((it)=>it.name===col);
                if(columnIndex !== -1){
                    extendReferenceContentType.columns.splice(columnIndex,1);
                }
                
            }
        }
        
        return extendReferenceContentType;
    }
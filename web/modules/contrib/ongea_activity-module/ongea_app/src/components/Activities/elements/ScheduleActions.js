import React from 'react';
import { ContentTypes } from '../../../config/content_types';
import {getStays, getBlankStaysByEvent, isParallelStay, isStayInPeriod, duplicateStays} from '../../../libs/utils/staysHelpers';
import AssignEventsForm from './AssignEventsForm';
import ActionSection from '../../elements/ActionSection';
import {getParams} from '../../../libs/api';

  
 

export default class ScheduleActions extends React.Component {
 
 constructor(props) {
    super(props);

    

     this.actions = {
          assignEvents: {id:'assignEvents', label:'assign_events_participants', title: "assign_events_participants", form:AssignEventsForm, action: (setProgress, checkedParallelEvents,events, mobilities)=>this.assignEvents(setProgress, checkedParallelEvents, events, mobilities), text: "intro_assign_schedule"},

}

  }


getFreshMobilities= async (mobilities,activityId)=>{

  const api = ContentTypes.Activities.api;
  const params = getParams('getSingleForForms', ContentTypes.Activities, this.props);

  return api.getSingle({id:activityId, ...params})
    .then((result)=>{
        const freshMobilities = result.body.mobilities;
        var approvedMobilities = [];

        if(freshMobilities && freshMobilities.length > 0){
            approvedMobilities = freshMobilities.filter((it)=>{
              return(mobilities.findIndex((mob)=>(mob.id===it.id))!==-1);
            });
        }
        return approvedMobilities;

    })
    .catch((error)=>{
      console.error(error);
    });


}


assignEvents = async (setProgress, checkedParallelEvents, events, mobilities)=>{
  this.props.setLoadingState(true);
  const activityId = this.props.data.id;
  const mobilitiesApi = ContentTypes.Mobilities.api;


  const stayExists = (blankStay, existingStays) => (existingStays.findIndex((it)=>{
                if(it.eventDay && it.eventDay.length>0 && blankStay.eventDay && blankStay.eventDay.length>0){
                  return(it.eventDay[0].id===blankStay.eventDay[0].id);
                }else{
                  
                  return(it.event.id===blankStay.event.id);
                } 
              })===-1)? false:true;


  const stayIsParallel = (blankStay, existingStays)=> existingStays.findIndex((it)=>{return isParallelStay(blankStay,it);})===-1 ? false : true;
  
  const afterMobilityUpdate = (result, lastIteration)=>{
                      setProgress(progress+=progressDelta);
                      

                      if(lastIteration){

                        this.props.setLoadingState(false);
                      }
                    };

  var progress = 0;
  var progressDelta = 0;
  setProgress(progress+=5);
  
  
  
  var approvedMobilities = await this.getFreshMobilities(mobilities, activityId);

  events = events.filter((event)=>(!event.parallelEvents || event.parallelEvents.length===0));

  if(checkedParallelEvents){
    Object.keys(checkedParallelEvents).map((pEvent)=>{
      if(pEvent && pEvent!==''){
        events.push({id:parseInt(checkedParallelEvents[pEvent],10)});
      }
      return true;
    });
  }
  setProgress(progress+=10);
  const allStays = await getStays(activityId);
  setProgress(progress+=20);
  var stays = [];
  for(var event of events){
    var blankStays = [];
    blankStays = getBlankStaysByEvent(allStays,event.id);
    stays.push(...blankStays);
  }
 
if(approvedMobilities.length > 0){
          progressDelta = (((100 - progress)/approvedMobilities.length)/2)+1;
          for(var i=0; i<approvedMobilities.length;i++){
            var mobility = approvedMobilities[i];
            const lastIteration = i===approvedMobilities.length-1;
            const mobilityStart = new Date(mobility.arrivalDate+' '+mobility.arrivalTime);
            const mobilityEnd = new Date(mobility.departureDate+' '+mobility.departureTime);
            var staysToBeDuplicated = [];

            setProgress(progress+=progressDelta);
            const existingStays = mobility.stays;
            var updatedStays = JSON.parse(JSON.stringify(existingStays));

 
            

            for(var blankStay of stays){

              var stayIsInPeriod = isStayInPeriod(blankStay,mobilityStart,mobilityEnd);

              if(!stayExists(blankStay, existingStays) && !stayIsParallel(blankStay, existingStays) && stayIsInPeriod){
                 //const dupStay = await duplicateStay(blankStay);
                 staysToBeDuplicated.push(blankStay);
                
                /*if(dupStay && dupStay.id){
                  updatedStays.push({id:dupStay.id});
                } 
                else{
                  console.error('Something went wrong duplicating a stay.');
                }*/
                
              }

            }

            const duplicatedStays = await duplicateStays(staysToBeDuplicated);

            if(duplicatedStays && duplicatedStays.length>0){
                for(var dupStay of duplicatedStays){

                    if(dupStay && dupStay.id){
                      updatedStays.push({id:dupStay.id});
                    } 
                    else{
                      console.error('Something went wrong duplicating a stay.');
                    }
                }
              } 
            


            const language = this.props.i18n && this.props.i18n.language ? this.props.i18n.language : 'en';
            const params={_format:'json', activityId:activityId, lan:language};
            
           await mobilitiesApi.update({id:mobility.id, ...params},{id:mobility.id,stays:updatedStays})
                  .then((result)=>afterMobilityUpdate(result, lastIteration))
                  .catch((error)=>{
                    console.error(error);
                    this.props.setLoadingState(false);
                  });
          }
  }else{
    setProgress(100);
    this.props.setLoadingState(false);
    console.log('there are no approved mobilities.');
  }
  //console.log('allMobilities', allMobilities);
}








  render() {

     
    
    return (
      <div>
      
        <ActionSection actions={this.actions} {...this.props} />

      </div>
  );
  }
}


import React from 'react';
import { ContentTypes } from '../../../config/content_types';
import {getStays, getBlankStaysByEvent, isParallelStay, isStayInPeriod, duplicateStays} from '../../../libs/utils/staysHelpers';
import AssignTravelsForm from './AssignTravelsForm';
import ActionSection from '../../elements/ActionSection';
import {getParams} from '../../../libs/api';
import {isInPeriod} from '../../../libs/utils/dateHelpers';


  
 

export default class TravelsActions extends React.Component {
 
 constructor(props) {
    super(props);

    

     this.actions = {
          assignTravels: {id:'assignTravels', label:'Assign travels to participants', title: "Assign travels to participants", form:AssignTravelsForm, action: (setProgress ,travels, mobilities)=>this.assignTravels(setProgress, travels, mobilities), text: "Assign travels to the following participants.\nTravels outside the mobility start and end dates of a participant will not be assigned to them."},

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


assignTravels = async (setProgress, travels, mobilities)=>{
  this.props.setLoadingState(true);
  const activityId = this.props.data.id;
  const mobilitiesApi = ContentTypes.Mobilities.api;

  
  const afterMobilityUpdate = (result, lastIteration)=>{
                      setProgress(progress+=progressDelta);
                      
                      

                      if(lastIteration){

                        this.props.setLoadingState(false);
                      }
                    };
  

  const exists = (travel, existingTravels) => (existingTravels.findIndex((it)=>(it.id===travel.id))!==-1);

  const inMobilityPeriod = (travel,startDate,endDate) => {
      var travelStart = new Date(travel.departureDate+' '+travel.departureTime);
      var travelEnd = new Date(travel.arrivalDate+' '+travel.arrivalTime);
      var mobilityStart = new Date(startDate+' '+'00:00');
      var mobilityEnd = new Date(endDate+' '+'24:00');


      return isInPeriod(travelStart,mobilityStart,mobilityEnd) && isInPeriod(travelEnd,mobilityStart,mobilityEnd);

  };

  var progress = 0;
  var progressDelta = 0;
  setProgress(progress+=5);
  
  if(travels && travels.length >0 ){

          var approvedMobilities = await this.getFreshMobilities(mobilities, activityId);
          console.log('approvedMobilities',approvedMobilities);

          

          
         
        if(approvedMobilities.length > 0){
                  progressDelta = (((100 - progress)/approvedMobilities.length)/2)+1;
                  for(var i=0; i<approvedMobilities.length;i++){
                    var mobility = approvedMobilities[i];
                    console.log('MOBILITY',mobility);
                    const lastIteration = i===approvedMobilities.length-1;
                    const mobilityStart = mobility.dateFrom;
                    const mobilityEnd = mobility.dateTo;
                    const existingTravels = mobility.travels;
                    var updatedTravels = existingTravels;

                    setProgress(progress+=progressDelta);
                    
                    

                    
                    for( var travel of travels){
                      if(travel && travel.id && !exists(travel, existingTravels) && inMobilityPeriod(travel,mobilityStart,mobilityEnd)){
                        updatedTravels.push({id:travel.id});
                      }
                    }
                    
                    
                    const language = this.props.i18n && this.props.i18n.language ? this.props.i18n.language : 'en';
                    const params={_format:'json', lan:language};
                    
                   await mobilitiesApi.update({id:mobility.id, ...params},{id:mobility.id,travels:updatedTravels})
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
    }else{
      console.log('No Travels to assign.');
      setProgress(100);
    }
  
}








  render() {

     
    
    return (
      <div>
      
        <ActionSection actions={this.actions} {...this.props} />

      </div>
  );
  }
}


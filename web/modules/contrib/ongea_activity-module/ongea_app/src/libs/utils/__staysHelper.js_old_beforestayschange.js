 
import { ContentTypes} from '../../config/content_types';
import {getDateForObj, getElapsedTime} from '../../libs/utils/dateHelpers';


export const getStaysByDate = (date,stays) => {
  return stays.filter((stay)=>{
    const dateObj = new Date(date);
    var stayDate = new Date(stay.event.startDate);

    if(stay.eventDay && stay.eventDay.length>0 && stay.eventDay[0].date){
            stayDate = new Date (stay.eventDay[0].date);
        }

    return (stayDate.getFullYear() === dateObj.getFullYear() && stayDate.getMonth() === dateObj.getMonth() && stayDate.getDate() === dateObj.getDate());

  });
}
 

export const removeStayInstances=(stays)=>{
  var returnStays = [];

  

  for(var stay of stays){
    const exists = (returnStays.findIndex((it)=>{
          if(it.eventDay && it.eventDay.length >0 && stay.eventDay && stay.eventDay.length > 0){
            return (it.eventDay[0].id === stay.eventDay[0].id);
          }else{
            return (it.event.id === stay.event.id);
          }
        }) === -1) ? false : true;

    if(!exists){
      returnStays.push(stay);
    }
  }
  return returnStays;
}






export const hasStayDuplicate=(stay,stays)=>{
    
    stays = stays.filter((it)=>(it.id !== stay.id));

    const exists = stays.findIndex((it)=>{
        if(it.eventDay && it.eventDay.length >0 && stay.eventDay && stay.eventDay.length > 0){
            return (it.eventDay[0].id === stay.eventDay[0].id);
          }else{
            return (it.event.id === stay.event.id);
          }

    }) !== -1;

    return exists;

}


export const orderStaysByDate=(stays)=>{

  const orderedStays = stays.sort(function(stayA,stayB){
        var dateA = stayA.event.startDate + ' ' + stayA.event.startTime;
        var dateB = stayB.event.startDate + ' ' + stayB.event.startTime;

        if(stayA.eventDay && stayA.eventDay.length > 0){
          dateA = stayA.eventDay[0].date;
        }
        if(stayB.eventDay && stayB.eventDay.length > 0){
          dateB = stayB.eventDay[0].date;
        }
        
        return Date.parse(dateA) - Date.parse(dateB);
    });

console.log(orderedStays.map((it)=>{
  return it.eventDay.length > 0 ? it.eventDay[0].date : it.event.startDate;

}));

return orderedStays;
}


export const removeStay=(stays,id)=>{
  console.log('removeStay');
    return stays.filter((stay)=>{
        return(parseInt(stay.id,10)!==id);
      });
}


export const removeParallelStays=(stay,formikStays, staysData)=>{

    if(formikStays && formikStays.length>0){
        if(stay){
          var parallelStays = getParallelStays(staysData,stay);
          if(parallelStays && parallelStays.length>0){
            for(var parallelStay of parallelStays){
              formikStays = formikStays.filter((it)=>(it.id!==parallelStay.id));
            }
          }
        }
        
      }
      return formikStays;
}

export const getStayById = (stays, id) => {
  const data = stays;
  return data.find((it)=>(it.id === id));
}


export const filterStaysByPlacesInActivity = async (stays, activityId) => {
  const activityApi = ContentTypes.Activities.api;
  const params={_format:'json'};
  return activityApi.getSingle({id:activityId, ...params})
      .then((result) => {
        //console.log(result.body,this._isMounted);
       

          var filteredStays = [];
          const places = result.body.places;
          if(stays && stays.length > 0 && stays && stays.length>0 && places && places.length>0){
             filteredStays = stays.filter((it)=>{
                if(it.event && it.event.place){
                  return places.find((place)=>(place.id === it.event.place.id)) !==  undefined;
                }else{
                  return true;
                }
             });
          }
          
          return filteredStays;
        
        
      })
      .catch((error) => {
        
        console.error(error);
         return [];
      });
  
}


export const getStays= async (activityId, cleanStays)=>{
	const staysApi = ContentTypes.Stays.api;
  const params={_format:'json'};

					const getCleanStays=(stays)=>{


				    console.log('stays',stays.length);
				    var filteredStays = [];
				    const deleteStays = stays.filter((it)=>{
				      if((!it.event) || (it.event && it.event.length===0) || ((it.roomNumber || it.reducedPrice)&&(!it.mobilityIds || (it.mobilityIds && it.mobilityIds.length===0)))){
				        return true;
				      }else{
				        filteredStays.push(it);
				      }

				        });
				    console.log('deleteStays',deleteStays);
					console.log('filteredStays',filteredStays);
				    
				    
				    

				    for(var stay of deleteStays){
				      console.log('id',stay.id);
				      staysApi.delete({id:stay.id, ...params})
				      .then((result) => {
				        //console.log(result.body,this._isMounted);
				        if(this._isMounted){
				          console.log('deltetd',stay.id, result.body);
				        }
				        

				      })
				      .catch((error) => {
				        if(this._isMounted){
				        this.setState({errorMessage:error,isLoadingCreateStay:false});}
				      });

				    }

				    return filteredStays;

					}




  
    return staysApi.getEntire({activityId:activityId, ...params})
      .then((result) => {
        //console.log('ggggg',result.body,this._isMounted);
        

        var resultStays = result.body;
        if(cleanStays){
         resultStays = getCleanStays(result.body); 
        }
        return resultStays;
        //console.log('cleanedStays',cleanedStays);
        /*return filterStaysByPlacesInActivity(resultStays, activityId)
        .then((stays)=>{
            //console.log('stays',stays);
            
            return stays;
        });*/
        
        
        

      });

}



export const isParallelStay=(stayA, stayB)=>{
  var isParallel = false;
  const parallelEventsA = stayA.event.parallelEvents;

  if(parallelEventsA && parallelEventsA.length>0){
    if(parallelEventsA.findIndex((it)=>(it.id===stayB.event.id))!==-1){
      isParallel = true;
    }
  }
  return isParallel;
}



export const getParallelStays=(stays, stay,forNesting)=>{
  const data = stays;
  
  const parallelEvents = stay.event ? stay.event.parallelEvents : [];
  const stayEvent = stay.event;
  
  var parallelStays = [];
  if(stayEvent && parallelEvents && parallelEvents.length >0){

    for(var parallelEvent of parallelEvents){
        var parallelStaysToThisEvent = [];
      if(forNesting){
         parallelStaysToThisEvent = data.filter((it)=>((it.event.id === parallelEvent.id) || (it.event.id === stayEvent.id)));
      }else{
         parallelStaysToThisEvent = data.filter((it)=>((it.event.id === parallelEvent.id) || ((it.event.id === stayEvent.id) && ( it.eventDay && stayEvent.eventDay && it.eventDay[0].id === stayEvent.id))));
      }
      
     
      if(parallelStaysToThisEvent){
        parallelStays.push(...parallelStaysToThisEvent);
      }
      
    }
  }
  
  return parallelStays;
}


export const getStayDates=(orderedStays, start, end)=>{
  /*const min = this.state.fields_Header.find((it)=>it.id==='dateFrom').value;
  const max = this.state.fields_Header.find((it)=>it.id==='dateTo').value;*/

  var minStamp = undefined;
  var maxStamp = undefined;
  if(start){
    minStamp = Date.parse(getDateForObj(start)+' '+'00:00:00');
  }
  if(end){
    maxStamp = Date.parse(getDateForObj(end)+' '+'24:00:00');
  }
  
  var dates = [];

  
    for(var stay of orderedStays){
      var date = undefined;
      if(stay.eventDay && stay.eventDay.length >0){
        date = getDateForObj(stay.eventDay[0].date);
      }else{
        date = getDateForObj(stay.event.startDate);
      }

      const exists = dates.indexOf(date)===-1 ? false : true;

      var isInPeriod = true;
      if(minStamp && !maxStamp){
          isInPeriod = minStamp < Date.parse(date)
      }else if (maxStamp && !minStamp){
        isInPeriod = Date.parse(date) < maxStamp;
      }else if(minStamp && maxStamp){
        isInPeriod = minStamp < Date.parse(date) && Date.parse(date) < maxStamp;
      }
      
       //console.log(minStamp+' <<'+ Date.parse(date)+'<<'+maxStamp);
      //console.log(date, isInPeriod);
      if(!exists && isInPeriod){
        dates.push(date);
      }
    }


  return dates;
}


export const getBlankStaysByEvent=(stays, eventId)=>{
  var blankStays = [];

  blankStays = stays.filter((stay)=>{
    return (stay.event.id===eventId && stay.roomNumber===null && stay.reducedPrice===false);
  });

  
  return blankStays;
}

export const getStayDuration = (stay) => {
  var duration = null;
  var start = stay.event.startDate+' '+stay.event.startTime;
  var end = stay.event.endDate+' '+stay.event.endTime;
  duration = getElapsedTime(start,end);

  return duration;
}


export const isStayInPeriod = (stay, start, end) => {
  var isInPeriod = false;


  var start = new Date(start).getTime();
  var end = new Date(end).getTime();
  var stayStart = getStayStartDate(stay).getTime();
  var stayEnd = getStayEndDate(stay).getTime();

if(isNaN(start) && isNaN(end)){
  isInPeriod = true;
}
else if(isNaN(start)){
  if(stayEnd < end) isInPeriod=true;
}
else if(isNaN(end)){
  if(start<stayStart) isInPeriod=true;
}
else{
  if(start<stayStart && stayEnd < end){
    isInPeriod = true;
  }
}
  

  return isInPeriod;
}


export const getStayStartDate = (stay) => {
  var startDate = null;

  if(stay.eventDay && stay.eventDay.length>0){
    startDate = new Date(stay.eventDay[0].date);
  }else{
    startDate = stay.event.startDate+' '+stay.event.startTime;
  }


  return new Date(startDate);
}

export const getStayEndDate = (stay) => {
  var endDate = null;
  const stayDuration = getStayDuration(stay);

  if(stay.eventDay && stay.eventDay.length>0){
    endDate = new Date(stay.eventDay[0].date).getTime() + stayDuration;
  }else{
    endDate = stay.event.endDate+' '+stay.event.endTime;
  }


  return new Date(endDate);
}


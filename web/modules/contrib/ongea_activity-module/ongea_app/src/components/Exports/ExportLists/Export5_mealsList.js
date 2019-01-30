import React from 'react';
import DownloadAndPrint from '../ExportElements/DownloadAndPrint';
import {withExportProvider} from '../withExportProvider';
import ExportSettings from '../ExportElements/ExportSettings';
import PrintPage from '../ExportElements/PrintPage';
import {getStaysByDate, orderStaysByDate, getStayDates,getStaysByPlace} from '../../../libs/utils/staysHelpers';
import Panel from '../../elements/Panel';
import { getDate} from '../../../libs/utils/dateHelpers';
import DateSettings from '../ExportElements/DateSettings';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import { SelectInput} from '../../elements/FormElements/FormElements';

class Export5_mealsList extends React.Component {

 constructor(props) {
        super(props);

        this.state = {
          stays:[],
          allStays:[],
          selectedPlaceId:null,
          places:null,
          dateFrom:props.data.dateFrom || null,
          initialDateFrom:props.data.dateFrom || null,
          dateTo:props.data.dateTo || null,
          initialDateTo:props.data.dateTo || null,
          dates:[],
          iteration:[],
          initialValues_Header:null,
          listColumns:null,
          allAdditionalRequirements:[]
        };
      
      }






componentDidMount() {

   const initialValues_Header = [
              {
                id:'title', 
                label: 'Title',
                value: this.props.data.title || undefined,
                type:'TextInput',
                visible:true
              },
              {
                id:'subtitle', 
                label: 'Subtitle',
                value: this.props.data.subtitle || undefined,
                type:'TextInput',
                visible:true
              },
              {
                id:'place', 
                label: 'place',
                value: undefined,
                type:'TextInput',
                visible:true
              }

              ];

  const listColumns = [
               
               
                {id: 'count', columnLabel:'', location: this.getPeopleCount,visible:true, order:1},
                {id: 'preference', columnLabel:'', location: 'id' ,visible:true,translate:true, order:2,sortBy:'asc'},
                {id: 'additional_food_requ', columnLabel:'', location: this.getAdditionalRequirements ,visible:true, order:3}
              ];



  const allStays = this.getStays(this.props.data);
  //const foodPreferences = this.getFoodPreferences(stays);
  //const iteration = getStayDates(stays, null, null, true);


  const places = this.getPlaces(allStays);

  //this.props.setData({listColumns:listColumns, data:foodPreferences, iteration:iteration, filterFunction:this.getPreferencesByDateAndEvent});
  //this.props.updateList(initialValues_Header,true);

  this.setState({allStays, places, initialValues_Header, listColumns});
        
      }


getStays=(data)=>{

  var stays = [];
  
  const mobilities = this.props.filterApproved(data.mobilities);

  const notExist = (mobilityStay) => (stays.findIndex((it)=>(it.id === mobilityStay.id)) === -1);

  if(mobilities && mobilities.length>0){
    for(var mobility of mobilities){
      const mobilityStays = mobility.stays;
      if(mobilityStays && mobilityStays.length > 0){
        for(var mobilityStay of mobilityStays){
          
          if(notExist(mobilityStay) && mobilityStay.event && mobilityStay.event.place && mobilityStay.event.category === 'meal'){
            stays.push(mobilityStay);

          }
        }
      } 
    }
  }
  
  
  stays = orderStaysByDate(stays);
  
  return (stays);

}




getPlaces = (stays) => {
  var places = [];

  const notExist = (place) => (places.findIndex((it)=>(it.id === place.id)) === -1);

  if(stays && stays.length>0){
    for(var stay of stays){
      if(stay && stay.event && stay.event.place && notExist(stay.event.place)){
        places.push(stay.event.place);
      }
    }
  }

  return places;
}

getIteration = (stays, dates) => {

  
  var iteration = [];

  const notExistEvent = (event, events)=> (events.findIndex((ev)=>(parseInt(ev.id,10) === parseInt(event.id,10)))===-1);

  if(dates && dates.length>0){
    for(var date of dates){
      var staysOnDate = getStaysByDate(date,stays);
      
      if(staysOnDate && staysOnDate.length>0){
        staysOnDate = orderStaysByDate(staysOnDate);
        var eventsOfDay = [];

            for(var stay of staysOnDate){
             
              if(stay && stay.eventDay && stay.eventDay.length>0 && notExistEvent(stay.eventDay[0], eventsOfDay)){
                eventsOfDay.push({id:stay.eventDay[0].id, startTime: stay.eventDay[0].date, title: stay.event.title, isEventDay:true});
                
              }else if(stay && (!stay.eventDay || stay.eventDay.length===0) && stay.event && notExistEvent(stay.event, eventsOfDay)){
                eventsOfDay.push({id:stay.event.id, startTime: stay.event.startDate+' '+stay.event.startTime, title: stay.event.title, isEventDay:false});
                
              }
              //console.log('eventsOfDay',JSON.parse(JSON.stringify(eventsOfDay)));
            }
      
            if(eventsOfDay && eventsOfDay.length>0){
              for(var event of eventsOfDay){
                iteration.push({date:date,event:event});
              }
            }

      }
    }
  }
  return iteration;
}

getPeopleCount = (pref,columnId,iteration) => {

  const allStays = this.state.stays;
  const staysOnDate = getStaysByDate(iteration.date,allStays, false);
  const staysOnEvent = this.getStaysByEvent(iteration,staysOnDate);
  const staysByPref = this.getStaysByFoodPreference(pref.id,staysOnEvent);

  

  return staysByPref.length;

}


getAdditionalRequirements = (pref,columnId,iteration) => {
  const allStays = this.state.stays;
  const allMobilities = this.props.data.mobilities;

  var additionalRequirements = [];
  var allAdditionalRequirements = this.state.allAdditionalRequirements;

  const findRequirement = (requ) => (allAdditionalRequirements.find((it)=>(it.description === requ)));

  const staysOnDate = getStaysByDate(iteration.date,allStays, false);
  const staysOnEvent = this.getStaysByEvent(iteration,staysOnDate);
  const staysByPref = this.getStaysByFoodPreference(pref.id,staysOnEvent);

  const mobilities = this.getMobilitiesFromStays(staysByPref,allMobilities);

  const mobilitiesByPref = this.getMobilitiesByPref(pref.id,mobilities);

  if(mobilitiesByPref && mobilitiesByPref.length>0){
    for(var mobility of mobilitiesByPref){
      if(mobility && mobility.participant && mobility.participant.foodRequirements){
        var id;
        const requirement = findRequirement(mobility.participant.foodRequirements);
        if(requirement === undefined){
          id = allAdditionalRequirements.length+1;
          allAdditionalRequirements.push({id:id,description:mobility.participant.foodRequirements});
          
        }else{
          id = requirement.id;
        }
        additionalRequirements.push('('+id+')');
      }
    }
  }
  this.setState({allAdditionalRequirements});
  return additionalRequirements.join(' ');

}

getStaysByFoodPreference = (prefID,stays) => {
  const allMobilities = this.props.data.mobilities;
  var staysByPref = [];

  const mobilities = this.getMobilitiesFromStays(stays,allMobilities);
  const mobilitiesByPref = this.getMobilitiesByPref(prefID,mobilities);

  if(mobilitiesByPref && mobilitiesByPref.length>0){
    staysByPref = stays.filter((stay)=>{
      const stayMobilities = stay.mobilityIds;
      return(stayMobilities.findIndex((mobID)=>(
          mobilitiesByPref.findIndex((mob)=>(
            parseInt(mobID.id,10) === parseInt(mob.id,10)))
          !==-1))
      !== -1);
    });
  }
  
  return staysByPref;

}

getMobilitiesByPref = (prefID,mobilities) => {
  var mobilitiesByPref = [];

  mobilitiesByPref = mobilities.filter((mob)=>{
    if(prefID === 'iEat_not_specified'){
      return(mob && mob.participant && mob.participant.iEat.constructor === Array);
    }else{
      return(mob && mob.participant && mob.participant.iEat === prefID);
    }
    
  });

  return mobilitiesByPref;
}


getMobilitiesFromStays = (stays, allMobilities) => {
  
  var mobilities = [];

  const findMob = (mob, mobs) => mobs.find((it)=>(parseInt(it.id,10) === parseInt(mob.id,10)));

  if(stays && stays.length>0){
    for(var stay of stays){
      const stayMobilities = stay.mobilityIds;
      if(stayMobilities && stayMobilities.length>0){
          for(var stayMob of stayMobilities){
              const stayMobility = findMob(stayMob, allMobilities)
              if(stayMobility && !findMob(stayMobility, mobilities)){
                mobilities.push(stayMobility);

              }
          }
      }
    }
  }

  return mobilities;
}


getPreferencesByDateAndEvent = (iteration,preferences) => {

    const allStays = this.state.stays;
  
    const staysOnDate = getStaysByDate(iteration.date,allStays, false);
    const staysOnEvent = this.getStaysByEvent(iteration,staysOnDate);
    const prefsOnDate = this.getFoodPreferences(staysOnEvent);
    return prefsOnDate;

}

getStaysByEvent = (iteration,stays) => {
 

  const staysOnEvent = stays.filter((stay)=>{
      const eventId= iteration.event.id;
      const isEventDay = iteration.event.isEventDay;

      if(stay && stay.eventDay && stay.eventDay.length>0 && isEventDay){
        return(parseInt(stay.eventDay[0].id,10) === parseInt(eventId,10));
      }else if(stay && (!stay.eventDay || stay.eventDay.length === 0) && stay.event && !isEventDay){
        return(parseInt(stay.event.id,10) === parseInt(eventId,10));
      }
      return false;
    });

  return staysOnEvent;
}

getFoodPreferences=(stays)=>{

  var foodPreferences = [];
  const mobilities = this.props.data.mobilities;

  const notExist = (pref) => (foodPreferences.findIndex((it)=>(it.id === pref)) === -1);
  
  
    
      const stayMobilities = this.getMobilitiesFromStays(stays,mobilities);
      
      if(stayMobilities && stayMobilities.length>0){
        for(var mobility of stayMobilities){
            if(mobility && mobility.participant){
            const mobPref = mobility.participant.iEat;
            if(mobPref){
              if(mobPref.constructor === Array && notExist('iEat_not_specified')){
                foodPreferences.push({id:'iEat_not_specified'});
              }else if(mobPref.constructor !== Array && notExist(mobPref)){
                
                foodPreferences.push({id:mobPref});
                
              }
              
              
            }

          }
        }

        
      }
      
  
  return foodPreferences;

}





handleChangeDates = (dateFrom,dateTo) => {
    const dates = getStayDates(this.state.stays,dateFrom, dateTo, true);
    const iteration = this.getIteration(this.state.stays, dates);
    this.setState({dateFrom,dateTo, dates, iteration}, 
          
         this.props.setData({iteration:iteration},true)
        );
}

handleChangePlace = (e) => {
  const selectedPlaceId = e.target.value;
  const allPlaces = this.state.places;
  var fields_Header = this.state.initialValues_Header;
  const placeName = allPlaces.find((it)=>(it.id===selectedPlaceId)).name;

  fields_Header.find((it)=>it.id==='place').value = placeName;

  const staysByPlace = getStaysByPlace({id:selectedPlaceId}, this.state.allStays);

  const foodPreferences = this.getFoodPreferences(staysByPlace);

  const dates = getStayDates(staysByPlace, null, null, true);
  const iteration = this.getIteration(staysByPlace, dates);
  const dateFrom = dates[0];
  const dateTo = dates[dates.length-1];

  this.props.setData({listColumns:this.state.listColumns, data:foodPreferences, iteration:iteration, filterFunction:this.getPreferencesByDateAndEvent}, false);

 

  this.setState(
    {selectedPlaceId, stays:staysByPlace, dates, iteration, dateFrom, dateTo, initialDateFrom:dateFrom, initialDateTo:dateTo},
    ()=>this.props.updateList(fields_Header,true)
  );
}


  buildFooter = () =>{
    const {allAdditionalRequirements} = this.state;
    var footer = [];

    if(allAdditionalRequirements && allAdditionalRequirements.length>0){
        footer.push(<h4 key="addrequ_header">{this.props.t('Additional food requirements')}</h4>);
        footer.push(allAdditionalRequirements.map((requ)=>{
            return(
                    <div key={"addrequ_"+requ.id}>
                      <span style={{marginRight:10+'px'}}>
                        {'('+requ.id+')'}
                      </span>
                      <span>
                        {requ.description}
                      </span>
                    </div>);
        }));
    }

    return footer;
  }

  
  render() {
    
    const {t, dataList, fields_Header, hasIndex,handleRequestSort, order, orderBy} = this.props;
    const {selectedPlaceId, iteration, places} = this.state;
    const headers = iteration.map((it)=>(getDate(it.date)+' - '+it.event.title));
    const admitUser = (this.props.readOnly === true) ? false : true;
     

    const footer = this.buildFooter();

    return (

      admitUser ? 
      <div>
      <div className="ongeaAct__exports_settings">
          <Panel label={t("Choose place")}>
                                <FormRowLayout infoLabel=''>
                                  <SelectInput
                                    id="place"
                                    disabled={!places}
                                    type="text"
                                    label={t("Place")}
                                    value={selectedPlaceId || ''}
                                    onChange={this.handleChangePlace}
                                    onBlur={()=>{return(true);}}
                                    options={places && places.length ? (places.map((place)=>{return({value:place.id,label:place.name});})):[{value:null,label:'No Places found in this Activity'}]}
                                  />
                                  {!places && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                                  </FormRowLayout>
          
            </Panel>
          {selectedPlaceId && <Panel label={t("choose_period")}>
                                
                      <DateSettings 
                        valueFrom={this.state.dateFrom}
                        valueTo={this.state.dateTo}
                        initialFrom={this.state.initialDateFrom}
                        initialTo={this.state.initialDateTo}
                        onChange={this.handleChangeDates}
                        disabled={false}
                        t={t}
                      />
                              
                    </Panel>}
      </div>

      

      {selectedPlaceId && <ExportSettings
              t={t} 
              handleReset={this.props.handleReset}
              handleChange_Header={this.props.handleChange_Header}
              fields_Header={fields_Header}
              handleChange_List={this.props.handleChange_List}
              columnVisibility={null}
              noIndex = {true}
              hr={true}
              
            />}
    
         {selectedPlaceId && <DownloadAndPrint 
                         t={t}
                         printSectionRef={this.componentRef}
                       />}
      
         {selectedPlaceId && <PrintPage 
                           ref={el => (this.componentRef = el)}
                           t={t}
                           fields_Header={fields_Header}
                           handleRequestSort = {handleRequestSort}
                           order={order}
                           commentHeader={''}
                           commentFooter={footer}
                           orderBy={orderBy}
                           dataList={dataList}
                           hasIndex={hasIndex}
                           isIterated={true}
                           headers={headers}
                         />
                       }

        

      </div>
      :
      <div class="ongeaAct__exports_noAdmittance">{t('no_admittance')}</div>
    );
  }
}


export default withExportProvider(Export5_mealsList);

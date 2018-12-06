import React from 'react';
import { ContentTypes } from '../../../config/content_types';
import Panel from '../../elements/Panel';
import {SelectInput} from '../../elements/FormElements/FormElements';
import Grid from '@material-ui/core/Grid';
import ActionTextBox from '../../elements/ActionTextBox';
import Button from '@material-ui/core/Button';
import {getStays, getBlankStaysByEvent, isParallelStay, isStayInPeriod} from '../../../libs/utils/staysHelpers';
import {RadioInput} from '../../elements/FormElements/FormElements';
import CircularProgress from '@material-ui/core/CircularProgress';
import AssignEventsForm from './AssignEventsForm';

  
 

export default class ScheduleActions extends React.Component {
 
 constructor(props) {
    super(props);

    this.state = {
      action: null,
      progress:0
     };

     this.actions = {
          assignEvents: {id:'assignEvents', label:'Assign events to participants', title: "Assign events to participants", form:AssignEventsForm, action: (checkedParallelEvents,events, mobilities)=>this.assignEvents(checkedParallelEvents, events, mobilities), text: "Assign events of this schedule to the following participants.\nEvents outside the arrival / departure times of a participant will not be assigned to them.\nRoom numbers, reduced price settings and the already existing attendance of parallel events will be preserved."},

}

  }

handleChange = (e) => {
  const action = this.actions[e.target.value];
  this.setState({action});

}



assignEvents = async (checkedParallelEvents, events, mobilities)=>{
  this.props.setLoadingState(true);
  const activityId = this.props.data.id;
  const staysApi = ContentTypes.Stays.api;
  const mobilitiesApi = ContentTypes.Mobilities.api;
  
  //const allMobilities = this.props.data.mobilities;
  var progress = 0;
  var progressDelta = 0;
  this.setProgress(progress+=5);
  
  //var approvedMobilities = allMobilities.filter((it)=>(it.participantStatus === 'approved'));
  

  var approvedMobilities = mobilities;
  console.log('approvedMobilities',approvedMobilities);

  events = events.filter((event)=>(!event.parallelEvents || event.parallelEvents.length===0));

  if(checkedParallelEvents){
    Object.keys(checkedParallelEvents).map((pEvent)=>{
      events.push({id:parseInt(checkedParallelEvents[pEvent],10)});
    });
  }
  this.setProgress(progress+=10);
  const allStays = await getStays(activityId);
  console.log('allStays:',allStays);
  this.setProgress(progress+=20);
  var stays = [];
  for(var event of events){
    var blankStays = [];
    blankStays = getBlankStaysByEvent(allStays,event.id);
    stays.push(...blankStays);
  }
  console.log('stays',stays);

if(approvedMobilities.length > 0){
          progressDelta = ((100 - progress)/approvedMobilities.length)/2;
          for(var mobility of approvedMobilities){
            const mobilityStart = new Date(mobility.arrivalDate+' '+mobility.arrivalTime);
            const mobilityEnd = new Date(mobility.departureDate+' '+mobility.departureTime);

            this.setProgress(progress+=progressDelta);
            const existingStays = mobility.stays;
            console.log('exisitngStays',existingStays);
            var updatedStays = JSON.parse(JSON.stringify(existingStays));

 
            

            for(var newStay of stays){
              console.log('Mobility Start',mobilityStart);
              console.log('Mobility End',mobilityEnd);


              const stayExists = (existingStays.findIndex((it)=>{
                if(it.eventDay && it.eventDay.length>0 && newStay.eventDay && newStay.eventDay.length>0){
                  return(it.eventDay[0].id===newStay.eventDay[0].id);
                }else{
                  
                  return(it.event.id===newStay.event.id);
                } 
              })===-1)? false:true;

              const stayIsParallel = existingStays.findIndex((it)=>{return isParallelStay(newStay,it);})===-1 ? false : true;

              var stayIsInPeriod = isStayInPeriod(newStay,mobilityStart,mobilityEnd);
              console.log('stayIsInPeriod',stayIsInPeriod);
              console.log('stay',newStay);

              if(!stayExists && !stayIsParallel && stayIsInPeriod){
                updatedStays.push({id:newStay.id});
              }

            }

            const language = this.props.i18n && this.props.i18n.language ? this.props.i18n.language : 'en';
            const params={_format:'json', activityId:activityId, lan:language};
            
            mobilitiesApi.update({id:mobility.id, ...params},{id:mobility.id,stays:updatedStays})
                  .then((result)=>{
                      this.setProgress(progress+=progressDelta);
                      console.log('success');
                      this.props.setLoadingState(false);
                    })
                  .catch((error)=>{
                    console.error(error);
                    this.props.setLoadingState(false);
                  });
          }
  }else{
    this.setProgress(100);
    this.props.setLoadingState(false);
    console.log('there are no approved mobilities.');
  }
  //console.log('allMobilities', allMobilities);
  console.log('approvedMobilities', approvedMobilities);
}




setProgress=(newProgress)=>{
  var progress = newProgress;
  if(newProgress >100) progress = 100;
  this.setState({progress});
}



  render() {

    const {action, progress} = this.state;
    const {isLoadingAction, formIsDirty} = this.props;
    
    var options = [];
    if(this.actions){
        options = Object.keys(this.actions).map((key)=>({value:key,label:this.actions[key].label}));
    }
    console.log(action);
    
    return (
      <div>
      
      <Panel label={'Actions'}>
      <Grid container spacing={32}>
          <Grid item xs={12} sm={6}>
            <SelectInput
                      id="action"
                      disabled={isLoadingAction}
                      type="text"
                      label={"Choose action"}
                      value={action && action.id}
                      onBlur={()=>{}}
                      onChange={this.handleChange}
                      options={options}
                    />


 
              {action && !formIsDirty && <action.form {...this.props} actionId={action.id} handleSubmit={action.action} />}


            
          </Grid>
          <Grid item xs={12} sm={6}>
            {action && action.text && <ActionTextBox title={action.title} formIsDirty={formIsDirty} text={action.text} progress={progress}/>}
          </Grid>
          <Grid item xs={12} sm={6}>
            
            </Grid>

      </Grid>
      </Panel>

      </div>
  );
  }
}


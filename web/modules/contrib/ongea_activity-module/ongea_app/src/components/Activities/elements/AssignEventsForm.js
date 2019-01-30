import React from 'react';
import {SelectInput, MultiSelectInput, SwitchInput} from '../../elements/FormElements/FormElements';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {RadioInput} from '../../elements/FormElements/FormElements';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {Lists} from '../../../config/content_types';
import FormHelperText from '@material-ui/core/FormHelperText';
 
  
export default class AssignEventsForm extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
        parallelEvents:[],
        isEntire:false,
        error:null,
        selectOptions:{},
        selectedEvents:[],
        allMobilities: props.data.mobilities.filter((it)=>(it && it.participantStatus === 'approved')),
        mobilities: props.data.mobilities.filter((it)=>(it && it.participantStatus === 'approved')),
        checkedParallelEvents:{},
        participantsOptions:{
                                all:
                                  {id:'all', label:'all_approved_participants', checked:true},
                                filterOrg:
                                  {id:'filterOrg', label:'filter_by_organisation', checked:false, value:null}, 
                                filterRole:
                                  {id:'filterRole', label:'filter_by_role', checked:false, value:null}, 
                                individual:
                                  {id:'individual', label:'select_individual', checked:false, value:null}
                                }
        
     };



  }





  getParallelEventsGroups = (events) => {
    
     var checked = [];
     var parallelEvents = [];


     const exists = (event)=> (parallelEvents.findIndex((it)=>{
                                return(it.findIndex((ev)=>(ev.id===event.id))!==-1);
                        }))!==-1;

     const getIndex = (event)=> parallelEvents.findIndex((it)=>{
                                return(it.findIndex((ev)=>{
                                  return(event.parallelEvents.findIndex((pev)=>(pev.id===ev.id)))!==-1;
                                })!==-1);
                        });


     for(var event of events){

      if(event.parallelEvents && event.parallelEvents.length > 0){
        

        if(!exists(event)){
          
          const index = getIndex(event);
          if(index!==-1){
            parallelEvents[index].push({id:event.id, title:event.title, subtitle:event.subtitle});
          }else{
            var i = parallelEvents.push([{id:event.id, title:event.title, subtitle:event.subtitle}]);
            checked['eventGroup_'+(i-1)] = event.id.toString();
          }
        }
        
      }
     }
     this.setState({parallelEvents, checkedParallelEvents:checked});
  }


  componentDidMount() {
    
    this.getSelectOptions();
    
     
  }





  handleChangeParallelEvents = (e,group) => { 

    
      var {checkedParallelEvents} = this.state;
      checkedParallelEvents[group] = e.target.value;
      this.setState({checkedParallelEvents});
   

  }

  handleChangeParticipants = (e) => { 

      var {participantsOptions} = this.state;

      const id = e.target.name.split('_');

      if(id[0]==='value'){
        participantsOptions[id[1]].value = e.target.value;
      }else{
          participantsOptions[e.target.name].checked = e.target.checked;

          if(e.target.checked === true){
              if(e.target.name === 'all'){
                  participantsOptions.filterRole.checked = false;
                  participantsOptions.filterOrg.checked = false;
                  participantsOptions.individual.checked = false;
              }
              else if(e.target.name === 'individual'){
                  participantsOptions.filterRole.checked = false;
                  participantsOptions.filterOrg.checked = false;
                  participantsOptions.all.checked = false;
              }
              else if(e.target.name === 'filterRole' || e.target.name === 'filterOrg'){
                  participantsOptions.individual.checked = false;
                  participantsOptions.all.checked = false;
              }
          }else{
              if(!participantsOptions.filterRole.checked && !participantsOptions.filterOrg.checked && !participantsOptions.individual.checked && !participantsOptions.all.checked){
                  participantsOptions[e.target.name].checked = true;
              }
          }
      }
      
      const mobilities = this.setMobilities(participantsOptions);

      this.setState({participantsOptions, mobilities});
    


  }


  handleChangeEvents = (e) => { 
    var selectedEvents = [];
    const allEvents = this.props.data.events;
    var {isEntire} = this.state;

    const findEvent = (eventId)=>allEvents.find((it)=>(it.id===eventId));


    if(e.target.name === 'isEntire'){
      selectedEvents = allEvents;
      isEntire = e.target.checked;
      if(e.target.checked === false){
        selectedEvents = [];
      }

    }else{
      for(var eventId of e.target.value){
        const event = findEvent(eventId);
        if(event){
          selectedEvents.push(event);
        }
      }

    }

    
      
    this.getParallelEventsGroups(selectedEvents);
    this.setState({selectedEvents, isEntire});
    

  }

  getSelectOptions = () => {

    var selectOptions = {};
    selectOptions.organisations = this.props.data.organisations.map((it)=>({label:it.title,value:it.id}));
    selectOptions.mobilities = this.state.mobilities.map((it)=>({label:it.participant.lastname+', '+it.participant.firstname,value:it.id}));

    
    selectOptions.events = this.props.data.events.map((it)=>({value:it.id,label:it.title}));
    

    Lists
        .getDataAsync(Lists.types['participantRole'])
        .then((result) => {

          selectOptions.participantRole = result;
          this.setState({selectOptions});
        })
        .catch((error) => {
              console.error(error);

        });
  }

  setMobilities=(participantsOptions)=>{
    
    var mobilities = this.state.allMobilities;
    

    if(participantsOptions.filterOrg.checked && participantsOptions.filterOrg.value){
      mobilities = mobilities.filter((it)=>{
        if(it.sendingOrganisation){
          return (it.sendingOrganisation.id===participantsOptions.filterOrg.value);
        }else{
          return false;
        }
        });
    }
    if(participantsOptions.filterRole.checked && participantsOptions.filterRole.value){
      mobilities = mobilities.filter((it)=>(it.participantRole===participantsOptions.filterRole.value));
    }
    if(participantsOptions.individual.checked && participantsOptions.individual.value){
      mobilities = [mobilities.find((it)=>(it.id===participantsOptions.individual.value))];
    }

    return mobilities;
  }

  validate=()=>{
    var error = null;

    const {selectedEvents, mobilities } = this.state;
    if(!selectedEvents || selectedEvents.length === 0){
      error = 'no_events_selected'
    }
    if(!mobilities || mobilities.length === 0){
      error = 'no_participants'
    }
    return error;
  }
  

  render(){

    const {parallelEvents, checkedParallelEvents, participantsOptions, selectOptions, mobilities, selectedEvents, isEntire, error} = this.state;
    const {t, handleSubmit, isLoadingAction, setProgress} = this.props;
    const showParallelEventsHeader = (parallelEvents.findIndex((it)=>(it.length >1)) !== -1) ? true : false;

    return( <div>

          <SwitchInput
                  id="isEntire"
                  disabled={isLoadingAction}
                  name="isEntire"
                  label={t("assign_entire_schedule")}
                  value={isEntire}
                  onChange={this.handleChangeEvents}
                  onBlur={()=>{}} 
                />
     
            <MultiSelectInput
                  className="assign_Events_And_Travels_Form_multiSelect"
                  id="events"
                  disabled={isLoadingAction || isEntire}
                  label={t("or_choose_events")}
                  value={selectedEvents.map((it)=>(it.id))}
                  onChange={this.handleChangeEvents}
                  onBlur={()=>{}}
                  options={selectOptions.events ? selectOptions.events : []}
                />  


       
       {(parallelEvents && parallelEvents.length >0 ) && showParallelEventsHeader &&
        <div> 
          <h4>{t('choose_one_parallel_event')}</h4>
               {parallelEvents.map((eventGroup, i)=>(
                <div key={'eventGroup_'+i}>
                  {(eventGroup.length > 1 )&& 
                                  <RadioInput 
                                      
                                      disabled={isLoadingAction}
                                      id={'eventGroup_'+i}
                                      label={'Group '+parseInt(i+1,10)}
                                      onChange={(e)=>this.handleChangeParallelEvents(e,'eventGroup_'+i)}
                                      onBlur={()=>{}}
                                      value={(checkedParallelEvents && checkedParallelEvents['eventGroup_'+i])}
                                      options={[{label:t('none_schedule_action'), value:''},...eventGroup.map((event)=>({label:event.title, value:event.id.toString()}))]}
                                      />
                    }
                  </div>

              ))}
       </div>
      }

    <h4>{t('assign_participants_selection')}</h4>

       <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
              <FormControlLabel
                      label={t(participantsOptions.all.label)}
                      control= 
                      {<Checkbox 
                        disabled={isLoadingAction}
                            checked = {participantsOptions.all.checked}
                            onChange = {this.handleChangeParticipants}
                            id = {'all'}
                            name = {'all'}
                            
                          />}
                 /> 
          </Grid>
          <Grid item xs={12} sm={6}>
          </Grid>
          <Grid item xs={12} sm={6}>
              <FormControlLabel
                      label={t(participantsOptions.filterOrg.label)}
                      control= 
                      {<Checkbox checked = {participantsOptions.filterOrg.checked}
                                disabled={isLoadingAction}
                            onChange = {this.handleChangeParticipants}
                            id = {'filterOrg'}
                            name = {'filterOrg'}
                            
                          />}
                 /> 
          </Grid>
          <Grid item xs={12} sm={6}>
                     {participantsOptions.filterOrg.checked && 
                                  <div>
                                      <SelectInput
                                           id="value_filterOrg"
                                           disabled={!participantsOptions.filterOrg.checked || isLoadingAction}
                                           type="text"
                                           label={t("choose_organisation")}
                                           value={participantsOptions.filterOrg.value}
                                           onBlur={()=>{}}
                                           onChange={this.handleChangeParticipants}
                                           options={selectOptions.organisations ? selectOptions.organisations : [{value:null, label:t('no_organisations')}]}
                                         />
                                    {!selectOptions.organisations && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>} 
                                    </div>          
                                       }
          </Grid>
          <Grid item xs={12} sm={6}>
              <FormControlLabel
                      label={t(participantsOptions.filterRole.label)}
                      control= 
                      {<Checkbox checked = {participantsOptions.filterRole.checked}
                              disabled={isLoadingAction}
                            onChange = {this.handleChangeParticipants}
                            id = {'filterRole'}
                            name = {'filterRole'}
                            
                          />}
                 /> 
          </Grid>
          <Grid item xs={12} sm={6}>
                  {participantsOptions.filterRole.checked && 
                                <div>
                                    <SelectInput
                                        id="value_filterRole"
                                        disabled={!participantsOptions.filterRole.checked || isLoadingAction}
                                        type="text"
                                        label={t("choose_role")}
                                        value={participantsOptions.filterRole.value}
                                        onBlur={()=>{}}
                                        onChange={this.handleChangeParticipants}
                                        options={selectOptions.participantRole ? selectOptions.participantRole : []}
                                      />
                                 {!selectOptions.participantRole && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>} 
                                </div>  
                                    }
          </Grid>
          <Grid item xs={12} sm={6}>
              <FormControlLabel
                      label={t(participantsOptions.individual.label)}
                      control= 
                      {<Checkbox checked = {participantsOptions.individual.checked}
                            disabled={isLoadingAction}
                            onChange = {this.handleChangeParticipants}
                            id = {'individual'}
                            name = {'individual'}
                            
                          />}
                 /> 
          </Grid>
          <Grid item xs={12} sm={6}>
          {participantsOptions.individual.checked && 
                        <div>
                          <SelectInput
                                id="value_individual"
                                disabled={!participantsOptions.individual.checked || isLoadingAction}
                                type="text"
                                label={t("choose_participant")}
                                value={participantsOptions.individual.value}
                                onBlur={()=>{}}
                                onChange={this.handleChangeParticipants}
                                options={selectOptions.mobilities ? selectOptions.mobilities : [{value:null, label:t('no_mobilities')}]}
                              />
                            {!selectOptions.mobilities && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                          </div>
                            }
          </Grid>

      </Grid>

        <FormHelperText error={(!!error)}>{t(error)}</FormHelperText>
        <div className='buttonWrapper'>
            <Button
                variant="contained"
                disabled={isLoadingAction}
                color="primary"
                onClick={()=>{

                  const error = this.validate();
                  
                  if(!error){
                    handleSubmit(setProgress, checkedParallelEvents,selectedEvents ,mobilities);
                    this.setState({error:null});
                  }else{
                    this.setState({error});
                  }
                  
                }}
                >
                {t('assign_now')}
              </Button>
              {isLoadingAction && <CircularProgress size={24} className='buttonProgress'/>}
        </div>
        
  
     </div> );

  }
}
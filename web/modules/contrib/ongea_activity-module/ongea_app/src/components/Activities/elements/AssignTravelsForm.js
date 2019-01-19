import React from 'react';
import {SelectInput, MultiSelectInput, SwitchInput} from '../../elements/FormElements/FormElements';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {Lists} from '../../../config/content_types';
import FormHelperText from '@material-ui/core/FormHelperText';
 
  
export default class AssignTravelsForm extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
        
        isEntire:false,
        error:null,
        selectOptions:{},
        selectedTravels:[],
        allMobilities: props.data.mobilities.filter((it)=>(it && it.participantStatus === 'approved')),
        mobilities: props.data.mobilities.filter((it)=>(it && it.participantStatus === 'approved')),
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





  


  componentDidMount() {
    
    this.getSelectOptions();
    
     
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


  handleChangeTravels = (e) => { 
    var selectedTravels = [];
    const allTravels = this.props.data.travels;
    var {isEntire} = this.state;

    const findTravel = (travelId)=>allTravels.find((it)=>(it.id===travelId));


    if(e.target.name === 'isEntire'){
      selectedTravels = allTravels;
      isEntire = e.target.checked;
      if(e.target.checked === false){
        selectedTravels = [];
      }

    }else{
      for(var travelId of e.target.value){
        const travel = findTravel(travelId);
        if(travel){
          selectedTravels.push(travel);
        }
      }

    }

    
      
    
    this.setState({selectedTravels, isEntire});
    

  }

  getSelectOptions = () => {

    var selectOptions = {};
    selectOptions.organisations = this.props.data.organisations.map((it)=>({label:it.title,value:it.id}));
    selectOptions.mobilities = this.state.mobilities.map((it)=>({label:it.participant.lastname+', '+it.participant.firstname,value:it.id}));

    
    selectOptions.travels = this.props.data.travels.map((it)=>({value:it.id,label:it.title}));
    

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

    const {selectedTravels, mobilities } = this.state;
    if(!selectedTravels || selectedTravels.length === 0){
      error = 'no_travels'
    }
    if(!mobilities || mobilities.length === 0){
      error = 'no_participants'
    }
    return error;
  }
  

  render(){

    const {participantsOptions, selectOptions, mobilities, selectedTravels, isEntire, error} = this.state;
    const {t,handleSubmit, isLoadingAction, setProgress} = this.props;

    return( <div>

          <SwitchInput
                  id="isEntire"
                  disabled={isLoadingAction}
                  name="isEntire"
                  label={t("assign_all_travels")}
                  value={isEntire}
                  onChange={this.handleChangeTravels}
                  onBlur={()=>{}}
                />
     
            <MultiSelectInput
                  id="travels"
                  disabled={isLoadingAction || isEntire}
                  label={t("or_choose_travels")}
                  value={selectedTravels.map((it)=>(it.id))}
                  onChange={this.handleChangeTravels}
                  onBlur={()=>{}}
                  options={selectOptions.travels ? selectOptions.travels : []}
                />  


       
       

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
                                           options={selectOptions.organisations ? selectOptions.organisations : [{value:null, label:'no organisations in this activity'}]}
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
                                options={selectOptions.mobilities ? selectOptions.mobilities : [{value:null, label:'no mobilities in this activity'}]}
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
                    handleSubmit(setProgress,selectedTravels ,mobilities);
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
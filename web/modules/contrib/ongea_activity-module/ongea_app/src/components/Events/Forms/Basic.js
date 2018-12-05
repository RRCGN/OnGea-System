import React from 'react';
import Panel from '../../elements/Panel';
import EditView from '../../_Views/EditView';
import { ContentTypes } from '../../../config/content_types';
import { TextInput, RadioInput, SelectInput, SwitchInput, DateInput, TimeInput,TextInputSelect, CheckboxInput} from '../../elements/FormElements/FormElements';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import DialogueForm from '../../_Views/DialogueForm';
import { Basic as NewPlace } from '../../Places/Forms/Basic';
import Button  from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {getParams} from '../../../libs/api';

export class BasicForm extends React.Component {
   
  constructor(props) {
        super(props);
    
        this.state = {
              data:this.props.data,
              repeatCycles:['hourly','daily', 'weekly'],
              openNewPlace: false,
              addedNewPlace: undefined,
              parallelEvent:null,
              parallelEvents:[],
              parallelEventsIsLoading: false,
              dirtyFormDialogue:false,
              places: null
        };
      }
   
 
  static defaultProps = {
    contentType: ContentTypes.Events,
    contentTypesForSelects:  [{contentType:ContentTypes.Events,additionalOptions:{value:null,label:'none'}}],
    listIdsforSelects: ['eventCategory']
  }
 
  componentDidMount() {
console.log('data',this.props);
    if((this.props.match && this.props.match.params.id === "new") || (this.props.isReference && this.props.referenceId === "new")){
      console.log('setInitial');
      this.setInitialValues();

    }
    this.getPlaces();

  }
  
  setInitialValues = () => {

        
              var data = {
                  category:null,
                  title:null,
                  subtitle:null,
                  description:null,
                  place:null,
                  startDate:null,
                  startTime:null,
                  endDate:null,
                  endTime:null,
                  repeatEvent:false,
                  repeatCycle:'daily',
                  repeatUntil:null,
                  //addEventAsDefault:false,
                  //limitParticipants:false,
                  //maximumNumberOfParticipants:null,
                  isVisible:false,
                  //participantCanDecideToAttend:false,
                  //lackOfDecisionWarning:false,
                  //decisionDeadline:null,
                  parallelEvents:null,

              };
              
              this.setState({data});
      }


  handleClickNewPlace = () => {
    this.setState({ openNewPlace: true });
  };

  


  cancelFormClose=()=>{
    this.setState({dirtyFormDialogue:false});
  }

  openDirtyFormDialogue = () => {
    this.setState({dirtyFormDialogue:true});
  }


  closeForm = ()=>{
   
    this.setState({ openNewPlace: false, dirtyFormDialogue:false });
    
  }


  handleClose = () => {
    
    if(this.props.formIsDirty){
      this.openDirtyFormDialogue();
    }else{
      this.closeForm();
      
    }
    
  };



  handleDialogueSave = (item) => {
    var places = this.state.places;
    
    console.log('Dialogue On Save', item);
    const addedNewPlace = item.id;
    console.log(addedNewPlace);


      if(places.findIndex((it)=>(it.value===addedNewPlace)) === -1) {
        places.push({value:item.id, label:item.name});
        
      }
          


    this.setState({ openNewPlace: false, places, addedNewPlace });

    this.addPlaceToActivity(item);
    
  }


  addPlaceToActivity=(place)=>{

    const api = ContentTypes.Activities.api;
    const activityId = this.props.parentData.id;
    var places = this.props.parentData.places;
    const params = {_format:'json'};

    places.push({id:place.id});

    api.update({id:activityId, ...params},{places:places})
      .then((result)=>{
        console.log('Successfully added place to activity.');
      })
      .catch((error)=>{
        console.error(error);
      });

  }
  

  handleChangeParallelEvents = (event, setFieldValue) => {

    this.setState({parallelEvent:event.target.value,parallelEventsIsLoading:true});

    if(event.target.value == null){
        this.setState({parallelEvents:[],parallelEventsIsLoading:false});
        setFieldValue('parallelEvents',[],true);
        return true;
    }

      
      var parallelEvents = [];
      const params={_format:'json'}
      const api = ContentTypes.Events.api;

      parallelEvents.push({id:event.target.value});

      api
        .getSingle({id:event.target.value, ...params})
        .then((result) => {
          //console.log(result);

            for(var i = 0; i < result.body.parallelEvents.length; i++){
              const event = result.body.parallelEvents[i];
              

              parallelEvents.push(event);
            }
          this.setState({parallelEvents,parallelEventsIsLoading:false});
          setFieldValue('parallelEvents',parallelEvents,true);

        })
        .catch((error) => {
          console.error(error);

        });

  
  }


getPlaces=()=>{
  const api = ContentTypes.Places.api;
  const params = getParams('selectsInForms', ContentTypes.Places, this.props);

  api.get(params)
    .then((result)=>{

      const places = result.body.map((place)=>({value:place.id, label:place.name}));
      console.log('ff');
      this.setState({places});

    })
    .catch((error)=>{
      console.error(error);
    }); 

}



  render() {
    
    const {repeatCycles, addedNewPlace, parallelEvent, parallelEvents, parallelEventsIsLoading, places} = this.state;
    const {data, ...props} = this.props;
    const readOnly = this.props.readOnly;
    

    return (
      <div>
        <EditView data={this.state.data} newPlace={addedNewPlace} {...props} render={(props, {selectOptions, events}) => 
        {


         
        
         
          
          
        return(

            <div>
                  

               <Panel label="Event">
                     
                    <FormRowLayout  infoLabel={props.t("Event category__description")} infoLabelFullHeight>
                      <Grid container spacing={24}>
                        <Grid item xs={12} sm={8}> 
                            {selectOptions.eventCategory ?
                            <RadioInput
                              id="category"
                              disabled={readOnly}
                              name="category"
                              label={props.t("Event category")}
                              error={props.touched.category && props.errors.category}
                              value={props.values.category ? props.values.category : null}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              setFieldValue={props.setFieldValue}
                              options={selectOptions.eventCategory ? selectOptions.eventCategory.map((setting)=>{return({value:setting.value,label:props.t(setting.label)})}) : []}
                            />
                             : <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}

                      </Grid>
                      </Grid>
                        </FormRowLayout>
             
              </Panel>

              <Panel label=''>
                     
                     <FormRowLayout infoLabel=''>
                          <TextInput
                            id="title"
                            disabled={readOnly}
                            type="text"
                            label={props.t("title")}
                            error={props.touched.title && props.errors.title}
                            value={props.values.title}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="subtitle"
                            type="text"
                            disabled={readOnly}
                            label={props.t("Subtitle")}
                            error={props.touched.subtitle && props.errors.subtitle}
                            value={props.values.subtitle}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 

                        <FormRowLayout infoLabel={props.t("Description__description")}>
                           <TextInput
                                id="description"
                                type="text"
                                disabled={readOnly}
                                label={props.t("Description")}
                                multiline
                                rows={7}
                                error={props.touched.description && props.errors.description}
                                value={props.values.description}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                        </FormRowLayout> 
             
              </Panel>

              <Panel>
              
              <Grid container spacing={24} alignItems={'stretch'}>
                <Grid item xs={12} sm={6}>
                <Panel label={props.t("Choose Place")}>
                <FormRowLayout>
                          <SelectInput
                                id="place"
                                type='text'
                                label={props.t("Place")}
                                disabled={places && !readOnly ? false : true}
                                error={props.touched.place && props.errors.place}
                                value={(props.values.place && props.values.place.id) || props.values.place}
                                onChange={(e)=>{

                                    props.setFieldValue('place',e.target.value);
                                  }}
                                onBlur={props.handleBlur}
                                options={(places && places.length >0) ? places : [{value:null,label:'no places in this activity'}]}
                              />
                              {!places && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                      </FormRowLayout>
                  </Panel>
                </Grid>

                {!readOnly && <Grid item xs={12} sm={6}>
                                <Panel label={props.t("New place")}>
                                  <Button className="fullWidth" variant="contained" color="primary" onClick={this.handleClickNewPlace}>{props.t('New')+" "+props.t("Place")}</Button>
                                  </Panel>
                                </Grid>}
                
              </Grid>
                     
              </Panel>




              <Panel>
                   
                       <FormRowLayout>
                       <Grid container spacing={24}>
                        <Grid item xs={12} sm={6}>
                            <DateInput
                              id="startDate"
                              disabled={readOnly}
                              label={props.t("Start date")}
                              error={props.touched.startDate && props.errors.startDate}
                              value={props.values.startDate}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                         </Grid>
                          <Grid item xs={12} sm={6}>       
                      
                            <TimeInput
                              id="startTime"
                              disabled={readOnly}
                              label={props.t("Start time")}
                              error={props.touched.startTime && props.errors.startTime}
                              value={props.values.startTime}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                          </Grid>
                        </Grid>
                       </FormRowLayout> 
                       <FormRowLayout>
                       <Grid container spacing={24}>
                        <Grid item xs={12} sm={6}>
                            <DateInput
                              id="endDate"
                              disabled={readOnly}
                              label={props.t("End date")}
                              error={props.touched.endDate && props.errors.endDate}
                              value={props.values.endDate}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                                    
                       </Grid>
                      <Grid item xs={12} sm={6}>  
                            <TimeInput
                              id="endTime"
                              disabled={readOnly}
                              label={props.t("End time")}
                              error={props.touched.endTime && props.errors.endTime}
                              value={props.values.endTime}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                        </Grid>
                        </Grid>            
                       </FormRowLayout> 
                    </Panel>
                    <Panel>
                       <FormRowLayout>
                       <SwitchInput 
                                id="repeatEvent"
                                disabled={readOnly}
                                label={props.t("Repeat this event")}
                                error={props.touched.repeatEvent && props.errors.repeatEvent}
                                value={props.values.repeatEvent}
                                onChange={(event)=>{
                                  
                                  props.setFieldTouched('repeatCycle', true, true);

                                  props.handleChange(event);
                                }}
                                onBlur={props.handleBlur}
                              />
                      </FormRowLayout> 
                      <FormRowLayout>
                          <TextInputSelect
                                id="repeatCycle"
                                type='text'
                                label=""
                                disabled={repeatCycles && props.values.repeatEvent && !readOnly ? false : true}
                                error={props.touched.repeatCycle && props.errors.repeatCycle}
                                value={props.values.repeatCycle || (repeatCycles && repeatCycles[1])}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                options={repeatCycles || []}
                              />
                              {!repeatCycles && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                      </FormRowLayout>
                      <FormRowLayout>
                      <DateInput
                              id="repeatUntil"
                              disabled={!props.values.repeatEvent || readOnly}
                              label={props.t("until")}
                              error={props.touched.repeatUntil && props.errors.repeatUntil}
                              value={props.values.repeatUntil}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                    </FormRowLayout>
                  </Panel>

                  {/*<Panel>
                                    
                                         <FormRowLayout infoLabel={props.t("Maximum number of participants__description")}>
                                         <Grid container spacing={24}>
                                          <Grid item xs={12} sm={8}>
                                         <CheckboxInput 
                                                  id="limitParticipants"
                                                  disabled={readOnly}
                                                  label={props.t("Maximum number of participants")}
                                                  error={props.touched.limitParticipants && props.errors.limitParticipants}
                                                  value={props.values.limitParticipants}
                                                  onChange={props.handleChange}
                                                  onBlur={props.handleBlur}
                                                />
                                        </Grid>
                                        <Grid item xs={12} sm={4}> 
                                        <NumberInput
                                                    id="maximumNumberOfParticipants"
                                                    disabled={!props.values.limitParticipants || readOnly}
                                                    type="text"
                                                    label={props.t("")}
                                                    error={props.touched.maximumNumberOfParticipants && props.errors.maximumNumberOfParticipants}
                                                    value={props.values.maximumNumberOfParticipants}
                                                    onChange={props.handleChange}
                                                    onBlur={props.handleBlur}
                                                    setFieldValue={props.setFieldValue}
                                                  />
                                        </Grid>
                                        </Grid>
                                        </FormRowLayout> 
                                    </Panel>*/}

                  <Panel>
                      <FormRowLayout infoLabel={props.t("Make this event visible to the public on linked websites__description")}>
                          <CheckboxInput 
                                id="isVisible"
                                disabled={readOnly}
                                label={props.t("Make this event visible to the public on linked websites")}
                                error={props.touched.isVisible && props.errors.isVisible}
                                value={props.values.isVisible}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                  </FormRowLayout>

                  </Panel>

                  {/*<Panel>
                                        <FormRowLayout infoLabel={props.t("Allow participants to edit their attendance__description")}>
                                            <CheckboxInput 
                                                  id="participantCanDecideToAttend"
                                                  label={props.t("Allow participants to edit their attendance")}
                                                  error={props.touched.participantCanDecideToAttend && props.errors.participantCanDecideToAttend}
                                                  value={props.values.participantCanDecideToAttend}
                                                  onChange={props.handleChange}
                                                  onBlur={props.handleBlur}
                                                />
                                    </FormRowLayout>
                                    <FormRowLayout infoLabel={props.t("Show warning if no selection between these parallel events was made until__description")}>
                                            <CheckboxInput 
                                                  id="lackOfDecisionWarning"
                                                  label={props.t("Show warning if no selection between these parallel events was made until")}
                                                  error={props.touched.lackOfDecisionWarning && props.errors.lackOfDecisionWarning}
                                                  value={props.values.lackOfDecisionWarning}
                                                  onChange={props.handleChange}
                                                  onBlur={props.handleBlur}
                                                />
                                    </FormRowLayout>
                                    <FormRowLayout>
                                        <DateInput
                                                id="decisionDeadline"
                                                disabled={!props.values.lackOfDecisionWarning}
                                                label={props.t("")}
                                                error={props.touched.decisionDeadline && props.errors.decisionDeadline}
                                                value={props.values.decisionDeadline}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                              />
                                      </FormRowLayout>
                  
                                    </Panel>*/}

                  <Panel label={props.t("Parallel events")}>
                    <input type="hidden" id="parallelEvents" value="props.values.parallelEvents" />
                    <FormRowLayout>
                              <SelectInput
                                    id="parallelEvent"
                                    disabled={readOnly}
                                    type='text'
                                    label={props.t("Parallel event")}
                                    error={props.touched.parallelEvents && props.errors.parallelEvents}
                                    value={parallelEvent}
                                    onChange={(event)=>this.handleChangeParallelEvents(event, props.setFieldValue)}
                                    onBlur={props.handleBlur}
                                    options={events || []}
                                  />
                                  {!events && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}


                                {(!parallelEventsIsLoading && parallelEvents.length >1) && <List subheader={<ListSubheader component="div">other parallel Events</ListSubheader>}>
                                    {parallelEvents.filter((event)=>{return(event.id!==parallelEvent)}).map((event)=>{return(
                                  <ListItem key={event.id}>
                                      <ListItemText
                                        primary={event.title}
                                        secondary={event.subtitle || null}
                                      />
                                    </ListItem>
                                    )}
                                  )}
                                </List>}
                               {parallelEventsIsLoading && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}

                          </FormRowLayout>
                  </Panel>
                  
                  

            </div>
          );}} />
              <DialogueForm index={2} title={"New place"} open={this.state.openNewPlace} onClose={this.handleClose}>
                               <NewPlace isReference onSave={this.handleDialogueSave} setDirtyFormState={this.props.setDirtyFormState} ></NewPlace>
                            </DialogueForm>


             
                 <Dialog
                  open={this.state.dirtyFormDialogue}
                  onClose={this.cancelFormClose}
                  >
                  <DialogTitle><p><span style={{textTransform:'uppercase'}}>unsubmitted form</span></p>
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {'Would you really like to close this unsubmitted form?'}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button  onClick={this.cancelFormClose} color="primary">{("cancel")}</Button>
                    <Button  onClick={this.closeForm} color="secondary">{("yes")}</Button>
                  </DialogActions>
                </Dialog>


              </div>
    )
  }
  
}

export const Basic = BasicForm;

import React from 'react';
import Panel from '../../elements/Panel';
import EditView from '../../_Views/EditView';
import { ContentTypes } from '../../../config/content_types';
import {TextInput, SelectInput,CheckboxInput, DateInput, NumberInput, CurrencyInput, TextInputSelect, CountryInput, TimeInput} from '../../elements/FormElements/FormElements';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogueForm from '../../_Views/DialogueForm';
import Button  from '@material-ui/core/Button';
import {Basic as ProfileBasic} from '../../Profiles/Forms/Basic';
import {getParams} from '../../../libs/api';


export class BasicForm extends React.Component {

  constructor(props) {
        super(props);
    
        this.state = {
          data: this.props.data,
          activityData:null,
          hasApplicationProcedure:true,
          openNewProfile: false,
          addedNewProfile: undefined
        };
      }
   
  static defaultProps = {
    contentType: ContentTypes.Mobilities,
    contentTypesForSelects:  [{contentType:ContentTypes.Organisations},{contentType:ContentTypes.Profiles}],
    listIdsforSelects: ['participantRole', 'participantStatus', 'roomRequirements', 'skillsAndInterests']

  }



  componentDidMount() {

    if(this.props.match.params.id === "new"){
      this.getActivityData();
      this.setInitialValues();

    }

  }

  componentWillReceiveProps(newProps) {
      if(newProps.data && newProps.data !== this.props.data){
        this.setState({data:newProps.data});
      }
  }
  
   setInitialValues = () => {
    
        //add activityId to Payload in Mobilities
              var data = {
                activityId: this.props.match.params.parentId,
                participant: null,
                participantRole:null,
                participantStatus: null,
                sendingOrganisation:null,
                dateFrom:null,
                dateTo:null,
                arrivalDate: null,
                arrivalTime:null,
                departureDate:null,
                departureTime:null,
                fromCountry:null,
                fromCityPlace:null,
                toCountry:null,
                toCityPlace:null,
                participantAgreement:null,
                participationFee:null,
                participationFeeCurrency:null,
                amountPaid:null,
                amountPaidCurrency:null,
                motivation:null,
                hearAbout:null,
                skillsAndInterest:null,
                skillsAndInterestDetails:null,
                roomRequirements:null,
                canShareWith:null,
                specialRequirements:null

              };
              
              this.setState({data});
      }
  

      getActivityData=()=>{
        const api = ContentTypes.Activities.api;
        const params = getParams('getSingleForForms', ContentTypes.Activities, this.props);
        if(this.props.match.params.parentId && this.props.match.params.id === "new"){

            api.getSingle({id:this.props.match.params.parentId, ...params})
              .then((result)=>{
                const hasApplicationProcedure = result.body.hasParticipantSelectProcedure ? true : false;
                
                  this.setState({activityData:result.body, hasApplicationProcedure});
                
                
              })
              .catch((error)=>{
                console.error(error);
              });
        }

      }

  /*updateApplicantStatus=(selectProcedure,setFieldValue)=>{
      if(selectProcedure===false){
        setFieldValue('participantStatus','approved');
      }else{
        setFieldValue('participantStatus','applicant');
      }
    }*/


  handleClickNewProfile = () => {
    this.setState({ openNewProfile: true });
  };

  handleDialogueClose = () => {
    this.setState({ openNewProfile: false });
  };

  handleDialogueSave = (item) => {
    //console.log('Dialogue On Save', item);
    const addedNewProfile = {value:item.id, label:item.firstname+' '+item.lastname};
    
    this.setState({ openNewProfile: false, addedNewProfile });
  }




    render() {

    
   
    const {data, ...props} = this.props;
    const {addedNewProfile, hasApplicationProcedure} = this.state;
    var inEditMode = false;
    const readOnly = this.props.readOnly;
    
    if(this.props.match.params.id !== "new"){
      inEditMode = true;
    }
    
    var profileValidationSchema = ContentTypes.Profiles.validationSchema(this.props);
        profileValidationSchema = profileValidationSchema.basic;

       return (
        <div>
           <EditView data={this.state.data} {...props} render={(props,{selectOptions, organisations, profiles}) => {


            var participantForTitle = null;

            if(props.data.participant){
              participantForTitle = props.data.participant.firstname+ ' '+ props.data.participant.lastname;
            }
            
            //handle Participant change
            const customHandleChange = (event) => {
    
              props.setFieldValue(event.target.name,{id:event.target.value});
            }

            if(profiles && addedNewProfile){
              if(profiles.indexOf(addedNewProfile) === -1) {
                profiles.push(addedNewProfile);
                props.setFieldValue('participant',{id:addedNewProfile.value});
              }
            }

            

            for(var selectKey in selectOptions){
              const select = selectOptions[selectKey];
              for(var option of select){
                if(option.label){
                  option.label = props.t(option.label);
                }
              }
            }

            
            

           return(

           <div>

             <input name="activityId" id="activityId" type='hidden' value={props.values.activityId || ''} />

             {!inEditMode && <Panel>
                        
                        <Grid container spacing={24} alignItems={'stretch'}>
                          <Grid item xs={12} sm={6}>
                          <Panel label={props.t("choose_profile")}>
                          <FormRowLayout>
                                    <SelectInput
                                          id="participant"
                                          type='text'
                                          label={props.t("Profile")}
                                          disabled={profiles ? false : true}
                                          error={props.touched.participant && props.t(props.errors.participant)}
                                          value={(props.values.participant && props.values.participant.id) ? props.values.participant.id : props.values.participant}
                                          onChange={customHandleChange}
                                          onBlur={props.handleBlur}
                                          options={profiles || []}
                                        />
                                        {!profiles && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                                </FormRowLayout>
                            </Panel>
                          </Grid>
          
                          <Grid item xs={12} sm={6}>
                          <Panel label={props.t("new_profile")}>
                            <Button className="fullWidth" variant="contained" color="primary" onClick={this.handleClickNewProfile}>{props.t("new_profile")}</Button>
                            </Panel>
                          </Grid>
                          
                        </Grid>
                               
              </Panel>}

           <Panel label={props.t("mobility_key_facts_for_",{replace:{Name:participantForTitle}})}>
                        <FormRowLayout infoLabel={props.t("Participant role__description")}>
                          <TextInputSelect
                                id="participantRole"  
                                disabled={selectOptions.participantRole && !readOnly ? false : true}
                                type='text'
                                label={props.t("Participant role")}
                                error={props.touched.participantRole && props.t(props.errors.participantRole)}
                                value={props.values.participantRole}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                options={selectOptions.participantRole ? selectOptions.participantRole : []}
                              />
                           {selectOptions.participantRole ? null : <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}

                        </FormRowLayout>

                        <FormRowLayout infoLabel={props.t("Participant status__description")}>
                          <TextInputSelect
                                id="participantStatus"
                                disabled={selectOptions.participantStatus && !readOnly ? false : true}
                                type='text'
                                label={props.t("Participant status")}
                                error={props.touched.participantStatus && props.t(props.errors.participantStatus)}
                                value={props.values.participantStatus || (hasApplicationProcedure?'applicant':'approved')}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                options={selectOptions.participantStatus ? selectOptions.participantStatus : []}
                              />
                            {selectOptions.participantStatus ? null : <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}

                        </FormRowLayout>

                        <FormRowLayout infoLabel={props.t("Sending organisation__description")}>
                                                
                                                <SelectInput
                                                  id="sendingOrganisation"
                                                  type="text"
                                                  disabled={organisations && !readOnly ? false : true}
                                                  label={props.t("Sending organisation")}
                                                  error={props.touched.sendingOrganisation && props.t(props.errors.sendingOrganisation)}
                                                  value={props.values.sendingOrganisation ? (props.values.sendingOrganisation.id || props.values.sendingOrganisation) : ''}
                                                  onChange={(event)=>{
                                                    props.setFieldValue('sendingOrganisation',{id:event.target.value});
                                                    
                                                  }}
                                                  onBlur={props.handleBlur}
                                                  options={organisations ? organisations : []}
                                                />
                                                {!organisations && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                           </FormRowLayout>
                      </Panel>
                      <Panel>
                           <FormRowLayout infoLabel={props.t("Mobility start date__description")+' / '+props.t("Mobility end date__description")}>
                                  <Grid container spacing={24}>
                                    <Grid item xs={12} sm={6}>
                                      <DateInput
                                        id="dateFrom"
                                        disabled={readOnly}
                                        label={props.t("Mobility start date")}
                                        error={props.touched.dateFrom && props.t(props.errors.dateFrom)}
                                        value={props.values.dateFrom}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                      />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                  <DateInput
                                          id="dateTo"
                                          disabled={readOnly}
                                          label={props.t("Mobility end date")}
                                          error={props.touched.dateTo && props.t(props.errors.dateTo)}
                                          value={props.values.dateTo}
                                          onChange={props.handleChange}
                                          onBlur={props.handleBlur}
                                        />
                                  </Grid>
                                  </Grid>
                              </FormRowLayout>
                              
                           <FormRowLayout infoLabel={'The participants arrival and departure to and from the activity.'}>
                          <Grid container spacing={24}>
                             <Grid item xs={12} sm={6}>
                              <DateInput
                              id="arrivalDate"
                              label={props.t("Arrival date")}
                              error={props.touched.arrivalDate && props.t(props.errors.arrivalDate)}
                              value={props.values.arrivalDate}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                                
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <DateInput
                                  id="departureDate"
                                  label={props.t("Departure date")}
                                  error={props.touched.departureDate && props.t(props.errors.departureDate)}
                                  value={props.values.departureDate}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                />
                            </Grid>
                                  </Grid>            
                           </FormRowLayout> 
                       

                      <FormRowLayout>
                      <Grid container spacing={24}>
                      <Grid item xs={12} sm={6}>
                      <TimeInput
                              id="arrivalTime"
                              label={props.t("Arrival time")}
                              error={props.touched.arrivalTime && props.t(props.errors.arrivalTime)}
                              value={props.values.arrivalTime}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                        
                            
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TimeInput
                              id="departureTime"
                              label={props.t("Departure time")}
                              error={props.touched.departureTime && props.t(props.errors.departureTime)}
                              value={props.values.departureTime}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                          </Grid>
                          </Grid>          
                       </FormRowLayout> 
                       


                      </Panel>

                      <Panel>
                             <FormRowLayout infoLabel=''>
                               <CountryInput
                                    id="fromCountry"
                                    disabled={readOnly}
                                    type='text'
                                    label={props.t("From country")}
                                    error={props.touched.fromCountry && props.t(props.errors.fromCountry)}
                                    value={props.values.fromCountry}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    setFieldValue={props.setFieldValue}
                                  />
                        </FormRowLayout> 

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="fromCityPlace"
                            disabled={readOnly}
                            type="text"
                            label={props.t("From city / place")}
                            error={props.touched.fromCityPlace && props.t(props.errors.fromCityPlace)}
                            value={props.values.fromCityPlace}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                        <FormRowLayout infoLabel=''>
                               <CountryInput
                                    id="toCountry"
                                    disabled={readOnly}
                                    type='text'
                                    label={props.t("To country")}
                                    error={props.touched.toCountry && props.t(props.errors.toCountry)}
                                    value={props.values.toCountry}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    setFieldValue={props.setFieldValue}
                                  />
                        </FormRowLayout> 

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="toCityPlace"
                            disabled={readOnly}
                            type="text"
                            label={props.t("To city / place")}
                            error={props.touched.toCityPlace && props.t(props.errors.toCityPlace)}
                            value={props.values.toCityPlace}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                      </Panel>

                  <Panel>
                      <FormRowLayout infoLabel={props.t("Participation agreement has been handed in__description")}>
                          <CheckboxInput
                                id="participantAgreement"
                                disabled={readOnly}
                                label={props.t("Participation agreement has been handed in")}
                                error={props.touched.participantAgreement && props.t(props.errors.participantAgreement)}
                                value={props.values.participantAgreement}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                        </FormRowLayout>

                  </Panel>
                  <Panel>
                  <FormRowLayout infoLabel={props.t("Participation fee__description")}>
                          <Grid container spacing={24}>
                            <Grid item xs={12} sm={6}>
                              
                                <NumberInput
                                  id="participationFee"
                                  disabled={readOnly}
                                  type="text"
                                  label={props.t("Participation fee")}
                                  error={props.touched.participationFee && props.t(props.errors.participationFee)}
                                  value={props.values.participationFee}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  setFieldValue={props.setFieldValue}
                                />
                              
                           </Grid>
                           <Grid item xs={12} sm={6}>
                             <CurrencyInput
                                id="participationFeeCurrency"
                                disabled={readOnly}
                                type='text'
                                label={props.t("Currency")}
                                error={props.touched.participationFeeCurrency && props.t(props.errors.participationFeeCurrency)}
                                value={props.values.participationFeeCurrency}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                         </Grid>
                      </Grid>
                    </FormRowLayout> 

                    <FormRowLayout infoLabel={props.t("Amount paid__description")}>
                          <Grid container spacing={24}>
                            <Grid item xs={12} sm={6}>
                              
                                <NumberInput
                                  id="amountPaid"
                                  disabled={readOnly}
                                  type="text"
                                  label={props.t("Amount paid")}
                                  error={props.touched.amountPaid && props.t(props.errors.amountPaid)}
                                  value={props.values.amountPaid}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  setFieldValue={props.setFieldValue}
                                />
                              
                           </Grid>
                           <Grid item xs={12} sm={6}>
                             <CurrencyInput
                                id="amountPaidCurrency"
                                disabled={readOnly}
                                type='text'
                                label={props.t("Currency")}
                                error={props.touched.amountPaidCurrency && props.t(props.errors.amountPaidCurrency)}
                                value={props.values.amountPaidCurrency}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                         </Grid>
                      </Grid>
                    </FormRowLayout> 
                </Panel>


                <Panel label="">
                    

                        <FormRowLayout infoLabel={props.t("What is your motivation to participate in this activity?__description")} infoLabelFullHeight>
                          <TextInput
                            id="motivation"
                            disabled={readOnly}
                            type="text"
                            multiline
                            rows={5}
                            label={props.t("What is your motivation to participate in this activity?")}
                            error={props.touched.motivation && props.t(props.errors.motivation)}
                            value={props.values.motivation}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>
                         <FormRowLayout infoLabel={props.t("How did you hear about this activity?__description")} infoLabelFullHeight>
                          <TextInput
                            id="hearAbout"
                            disabled={readOnly}
                            type="text"
                            label={props.t("How did you hear about this activity?")}
                            error={props.touched.hearAbout && props.t(props.errors.hearAbout)}
                            value={props.values.hearAbout}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                </Panel>
                {/*<Panel label="">
                                        <FormRowLayout>
                                        <CheckboxGroupInput
                                          id="skillsAndInterest"
                                          label={props.t("Skills and interests for this activity")}
                                          disabled={!props.readOnly && selectOptions.skillsAndInterests ? false : true}
                                          error={props.touched.skillsAndInterest && props.t(props.errors.skillsAndInterest)}
                                          value={props.values.skillsAndInterest}
                                          setFieldValue={props.setFieldValue}
                                          options={selectOptions.skillsAndInterests ? selectOptions.skillsAndInterests:[]}
                                        />
                                       {selectOptions.skillsAndInterests ? null : <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                
                                        </FormRowLayout>
                                        <FormRowLayout>
                                              <TextInput
                                                id="skillsAndInterestDetails"
                                                type="text"
                                                disabled={props.readOnly}
                                                label={props.t("Skills and interests details for this activity")}
                                                multiline
                                                rows={6}
                                                error={props.touched.skillsAndInterestDetails && props.t(props.errors.skillsAndInterestDetails)}
                                                value={props.values.skillsAndInterestDetails}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                              />
                                        </FormRowLayout>
                
                                </Panel>*/}

                <Panel label={props.t("accomodation_requirements")}>
                    <FormRowLayout>
                          <TextInputSelect
                                id="roomRequirements"
                                disabled={selectOptions.roomRequirements && !readOnly ? false : true}
                                type='text'
                                label={props.t("Room requirements")}
                                error={props.touched.roomRequirements && props.t(props.errors.roomRequirements)}
                                value={props.values.roomRequirements}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                options={selectOptions.roomRequirements ? selectOptions.roomRequirements : []}
                              />
                           {selectOptions.roomRequirements ? null : <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}

                        </FormRowLayout>

                         <FormRowLayout infoLabel=''>
                          <TextInput
                            id="canShareWith"
                            disabled={readOnly}
                            type="text"
                            label={props.t("Can share with")}
                            error={props.touched.canShareWith && props.t(props.errors.canShareWith)}
                            value={props.values.canShareWith}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="specialRequirements"
                            disabled={readOnly}
                            type="text"
                            multiline
                            rows={5}
                            label={props.t("Special accommodation requirements")}
                            error={props.touched.specialRequirements && props.t(props.errors.specialRequirements)}
                            value={props.values.specialRequirements}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                </Panel>



            </div>
          );}} />

         <DialogueForm index={1} title={"new_profile"} open={this.state.openNewProfile} onClose={this.handleDialogueClose}>
                 <ProfileBasic onSave={this.handleDialogueSave} validation={profileValidationSchema ? profileValidationSchema : false}  isReference={true} referenceId='new' setDirtyFormState={this.props.setDirtyFormState} formIsDirty={this.props.formIsDirty} />
        </DialogueForm>
      </div>
        );
    }
}

export const Basic = BasicForm;

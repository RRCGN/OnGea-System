import React from 'react';
import Panel from '../../elements/Panel';
import EditView from '../../_Views/EditView';
import { ContentTypes } from '../../../config/content_types';
import {TextInput, SelectInput,CheckboxInput, DateInput, NumberInput, CurrencyInput, TextInputSelect, CountryInput} from '../../elements/FormElements/FormElements';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogueForm from '../../_Views/DialogueForm';
import Button  from '@material-ui/core/Button';
import {Basic as ProfileBasic} from '../../Profiles/Forms/Basic';


export class BasicForm extends React.Component {

  constructor(props) {
        super(props);
    
        this.state = {
          data: this.props.data,
          openNewProfile: false,
          addedNewProfile: undefined
        };
      }
   
  static defaultProps = {
    contentType: ContentTypes.Mobilities,
    contentTypesForSelects:  [{contentType:ContentTypes.Organisations},{contentType:ContentTypes.Profiles}],
    listIdsforSelects: ['participantRole', 'participantStatus', 'roomRequirements']

  }



  componentDidMount() {

    if(this.props.match.params.id === "new"){
      this.setInitialValues();

    }

  }
  
   setInitialValues = () => {

        //add activityId to Payload in Mobilities
              var data = {
                activityId: this.props.match.params.parentId,
                participant: null,
                participantRole:null,
                participantStatus:null,
                sendingOrganisation:null,
                dateFrom:null,
                dateTo:null,
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
                roomRequirements:null,
                canShareWith:null,
                specialRequirements:null

              };
              
              this.setState({data});
      }
  

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
    const {addedNewProfile} = this.state;
    var inEditMode = false;

    
    if(this.props.match.params.id !== "new"){
      inEditMode = true;
    }


       return (
        <div>
           <EditView data={this.state.data} {...props} render={(props,{selectOptions, organisations, profiles}) => {


            var participantForTitle = null;

            if(props.data.participant){
              participantForTitle = props.data.participant.firstname+ ' '+ props.data.participant.lastname;
            }
            

            const customHandleChange = (event) => {
            //console.log('FFF',event.target);
    
              props.setFieldValue(event.target.name,{id:event.target.value});
            }

            if(profiles && addedNewProfile){
              if(profiles.indexOf(addedNewProfile) === -1) {
                profiles.push(addedNewProfile);
                props.setFieldValue('participant',{id:addedNewProfile.value});
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
                                          error={props.touched.participant && props.errors.participant}
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

           <Panel label={props.t("mobility_key_facts_for_")+(participantForTitle ? (' '+participantForTitle):'')}>
                        <FormRowLayout infoLabel={props.t("Participant role__description")}>
                          <TextInputSelect
                                id="participantRole"  
                                disabled={selectOptions.participantRole ? false : true}
                                type='text'
                                label={props.t("Participant role")}
                                error={props.touched.participantRole && props.errors.participantRole}
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
                                disabled={selectOptions.participantStatus ? false : true}
                                type='text'
                                label={props.t("Participant status")}
                                error={props.touched.participantStatus && props.errors.participantStatus}
                                value={props.values.participantStatus}
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
                                                  disabled={organisations ? false : true}
                                                  label={props.t("Sending organisation")}
                                                  error={props.touched.sendingOrganisation && props.errors.sendingOrganisation}
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
                           <FormRowLayout infoLabel={props.t("Mobility start date__description")}>
                                  
                                      <DateInput
                                        id="dateFrom"
                                        label={props.t("Mobility start date")}
                                        error={props.touched.dateFrom && props.errors.dateFrom}
                                        value={props.values.dateFrom}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                      />
                              </FormRowLayout>
                              <FormRowLayout infoLabel={props.t("Mobility end date__description")}>      
                                        <DateInput
                                          id="dateTo"
                                          label={props.t("Mobility end date")}
                                          error={props.touched.dateTo && props.errors.dateTo}
                                          value={props.values.dateTo}
                                          onChange={props.handleChange}
                                          onBlur={props.handleBlur}
                                        />
                                        
                                     
                             </FormRowLayout>
                      </Panel>
                      <Panel>
                             <FormRowLayout infoLabel=''>
                               <CountryInput
                                    id="fromCountry"
                                    type='text'
                                    label={props.t("From country")}
                                    error={props.touched.fromCountry && props.errors.fromCountry}
                                    value={props.values.fromCountry}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    setFieldValue={props.setFieldValue}
                                  />
                        </FormRowLayout> 

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="fromCityPlace"
                            type="text"
                            label={props.t("From city / place")}
                            error={props.touched.fromCityPlace && props.errors.fromCityPlace}
                            value={props.values.fromCityPlace}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                        <FormRowLayout infoLabel=''>
                               <CountryInput
                                    id="toCountry"
                                    type='text'
                                    label={props.t("To country")}
                                    error={props.touched.toCountry && props.errors.toCountry}
                                    value={props.values.toCountry}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    setFieldValue={props.setFieldValue}
                                  />
                        </FormRowLayout> 

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="toCityPlace"
                            type="text"
                            label={props.t("To city / place")}
                            error={props.touched.toCityPlace && props.errors.toCityPlace}
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
                                label={props.t("Participation agreement has been handed in")}
                                error={props.touched.participantAgreement && props.errors.participantAgreement}
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
                                  type="text"
                                  label={props.t("Participation fee")}
                                  error={props.touched.participationFee && props.errors.participationFee}
                                  value={props.values.participationFee}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  setFieldValue={props.setFieldValue}
                                />
                              
                           </Grid>
                           <Grid item xs={12} sm={6}>
                             <CurrencyInput
                                id="participationFeeCurrency"
                                type='text'
                                label={props.t("Currency")}
                                error={props.touched.participationFeeCurrency && props.errors.participationFeeCurrency}
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
                                  type="text"
                                  label={props.t("Amount paid")}
                                  error={props.touched.amountPaid && props.errors.amountPaid}
                                  value={props.values.participationFee}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  setFieldValue={props.setFieldValue}
                                />
                              
                           </Grid>
                           <Grid item xs={12} sm={6}>
                             <CurrencyInput
                                id="amountPaidCurrency"
                                type='text'
                                label={props.t("Currency")}
                                error={props.touched.amountPaidCurrency && props.errors.amountPaidCurrency}
                                value={props.values.amountPaidCurrency}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                         </Grid>
                      </Grid>
                    </FormRowLayout> 
                </Panel>


                <Panel label="">
                    

                        <FormRowLayout infoLabel={props.t("What is your motivation to participate in this project?__description")} infoLabelFullHeight>
                          <TextInput
                            id="motivation:,
                            "
                            type="text"
                            multiline
                            rows={5}
                            label={props.t("What is your motivation to participate in this project?")}
                            error={props.touched.motivation && props.errors.motivation}
                            value={props.values.motivation}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>
                         <FormRowLayout infoLabel={props.t("How did you hear about this project?__description")} infoLabelFullHeight>
                          <TextInput
                            id="hearAbout"
                            type="text"
                            label={props.t("How did you hear about this project?")}
                            error={props.touched.hearAbout && props.errors.hearAbout}
                            value={props.values.hearAbout}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                </Panel>

                <Panel label="Accomodation requirements">
                    <FormRowLayout infoLabel={props.t("Room requirements__description")}>
                          <TextInputSelect
                                id="roomRequirements"
                                disabled={selectOptions.roomRequirements ? false : true}
                                type='text'
                                label={props.t("Room requirements")}
                                error={props.touched.roomRequirements && props.errors.roomRequirements}
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
                            type="text"
                            label={props.t("Can share with")}
                            error={props.touched.canShareWith && props.errors.canShareWith}
                            value={props.values.canShareWith}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="specialRequirements"
                            type="text"
                            multiline
                            rows={5}
                            label={props.t("Special accommodation requirements")}
                            error={props.touched.specialRequirements && props.errors.specialRequirements}
                            value={props.values.specialRequirements}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                </Panel>



            </div>
          );}} />

         <DialogueForm index={1} title={"new_profile"} open={this.state.openNewProfile} onClose={this.handleDialogueClose}>
                 <ProfileBasic onSave={this.handleDialogueSave} ></ProfileBasic>
        </DialogueForm>
      </div>
        );
    }
}

export const Basic = BasicForm;

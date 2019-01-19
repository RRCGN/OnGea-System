import React from 'react';
import Panel from '../../elements/Panel';
import EditView from '../../_Views/EditView';
import { ContentTypes } from '../../../config/content_types';
import {TextInput, SelectInput,CheckboxInput, DateInput, SwitchInput, NumberInput, CurrencyInput, TextInputSelect,MultiSelectInput} from '../../elements/FormElements/FormElements';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import Grid from '@material-ui/core/Grid';
import FileUpload from '../../elements/FormElements/FileUpload';
import {config} from '../../../config/config';
import CircularProgress from '@material-ui/core/CircularProgress';



export class BasicForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data
                      
     };
  }
 
 static defaultProps = {
    contentType: ContentTypes.Activities,
    contentTypesForSelects:  {contentType:ContentTypes.Project}
  }

  componentWillReceiveProps(newProps) {
      if(newProps.data && newProps.data !== this.props.data){
        this.setState({data:newProps.data});
      }
  }

  componentDidMount() {

    
    if((this.props.match && this.props.match.params.id === "new") || (this.props.isReference && this.props.referenceId === 'new')){

      this.setInitialValues();

    }

  }
  
  setInitialValues = () => {

        
              var data = {
                project:this.props.parentId || null,
                title:null,
                subtitle:null,
                description:null,
                dateFrom:null,
                dateFromIsProgramDay:false,
                dateTo:null,
                dateToIsProgramDay:false,
                longTermActivity:false,
                image:null,
                participationFee:null,
                participationFeeCurrency:null,
                participationFeeReduced:null,
                participationFeeReducedCurrency:null,
                eligibleReduction:null,
                erasmusIsFunded:false,
                erasmusGrantAgreementNumber:null,
                erasmusActivityNumber:null,
                erasmusActivityType:null,
                mainWorkingLanguage:null,
                hasParticipantSelectProcedure:false,
                canEditTravels:false,
                canEditStays:false,
                showToName:false,
                showToMail:false,
                showToPhone:false,
                showToSkills:false

              };
              
              this.setState({data});
      }

    render() {
      const {data, ...props} = this.props;
      const readOnly = this.props.readOnly;
      return (
           <EditView data={this.state.data} {...props} render={(props,{projects}) => (
            <div>
            
                      {(!props.isReference) ? <Panel label={props.t("choose_project")}>
                                              <FormRowLayout infoLabel=''>
                                                <SelectInput
                                                  id="project"
                                                  type="text"
                                                  disabled={!readOnly && projects ? false : true}
                                                  label={props.t("project")}
                                                  error={props.touched.project && props.t(props.errors.project)}
                                                  value={props.values.project ? (props.values.project.id || props.values.project) : ''}
                                                  onChange={(event)=>{

                                                    props.setFieldValue('project',{id:event.target.value});
                                                  }}
                                                  onBlur={props.handleBlur}
                                                  options={projects ? projects :[]}
                                                />
                                                {!projects && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                                                </FormRowLayout>
                                          </Panel> 
                                          : 
                          <input name="project" id="project" type='hidden' value={props.parentId || ''} />
                                        }
                   
                   <Panel label={props.t("activity_basic_settings")}>
                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="title"
                            disabled={readOnly}
                            type="text"
                            label={props.t("Activity title")}
                            error={props.touched.title && props.t(props.errors.title)}
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
                            label={props.t("Activity subtitle")}
                            error={props.touched.subtitle && props.t(props.errors.subtitle)}
                            value={props.values.subtitle}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                        <FormRowLayout>
                              <TextInput
                                id="description"
                                type="text"
                                disabled={readOnly}
                                label={props.t("Activity description")}
                                multiline
                                error={props.touched.description && props.t(props.errors.description)}
                                value={props.values.description ? (props.values.description.value || props.values.description) : ''}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                        </FormRowLayout>
                      </Panel>

                       <Panel label={props.t("activity_period")}>
                       

                        <FormRowLayout>
                                  <Grid container spacing={24}>
                                   <Grid item xs={12} sm={6}>
                                      <DateInput
                                        id="dateFrom"
                                        disabled={readOnly}
                                        label={props.t("Arrival date")}
                                        error={props.touched.dateFrom && props.t(props.errors.dateFrom)}
                                        value={props.values.dateFrom}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                      />
                                      <CheckboxInput
                                          id="dateFromIsProgramDay"
                                          disabled={readOnly}
                                          label={props.t("Arrival date is a program day")}
                                          error={props.touched.dateFromIsProgramDay && props.t(props.errors.dateFromIsProgramDay)}
                                          value={props.values.dateFromIsProgramDay}
                                          onChange={props.handleChange}
                                          onBlur={props.handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DateInput
                                          id="dateTo"
                                          disabled={readOnly}
                                          label={props.t("Departure date")}
                                          error={props.touched.dateTo && props.t(props.errors.dateTo)}
                                          value={props.values.dateTo}
                                          onChange={props.handleChange}
                                          onBlur={props.handleBlur}
                                        />
                                        <CheckboxInput
                                            id="dateToIsProgramDay"
                                            disabled={readOnly}
                                            label={props.t("Departure date is a program day")}
                                            error={props.touched.dateToIsProgramDay && props.t(props.errors.dateToIsProgramDay)}
                                            value={props.values.dateToIsProgramDay}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                          />
                                      </Grid>
                                    </Grid>
                                </FormRowLayout>
                                <FormRowLayout infoLabel={props.t('Long term activity__description')}>
                                  <CheckboxInput
                                    id="longTermActivity"
                                    disabled={readOnly}
                                    label={props.t("Long term activity")}
                                    error={props.touched.longTermActivity && props.t(props.errors.longTermActivity)}
                                    value={props.values.longTermActivity}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                  />
                                </FormRowLayout>
                          </Panel>
                    
                    <Panel label={props.t("image")}>
                            <FormRowLayout infoLabel={props.t("Upload photo__description")}>
                            <FileUpload 
                                id="image"
                                disabled={readOnly}
                                label={props.t("Upload photo")}
                                snackbar={props.snackbar} 
                                accept={'image/jpeg, image/png, image/gif'}
                                text={props.t('try_dropping_files')}
                                countLimit={1}
                                value={props.values.image}
                                setFieldValue={props.setFieldValue}
                                filesAreImages={true}
                                />
                          </FormRowLayout>
                        </Panel>
                    

                    <Panel label={props.t("participation_fee")}>
                        
                        <FormRowLayout infoLabel=''>
                          <Grid container spacing={24}>
                              <Grid item xs={12} sm={8}>
                                <NumberInput
                                  id="participationFee"      
                                  type="text"
                                  disabled={readOnly}
                                  label={props.t("Participation fee")}
                                  error={props.touched.participationFee && props.t(props.errors.participationFee)}
                                  value={props.values.participationFee}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  setFieldValue={props.setFieldValue}
                                />
                           </Grid>
                           <Grid item xs={12} sm={4}>
                             <CurrencyInput
                                id="participationFeeCurrency"
                                type='text'
                                disabled={readOnly}
                                label={props.t("Currency")}
                                placeholder="choose a currency"
                                error={props.touched.participationFeeCurrency && props.t(props.errors.participationFeeCurrency)}
                                value={props.values.participationFeeCurrency}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                            </Grid>
                          </Grid>
                        </FormRowLayout> 
                    
                        <FormRowLayout infoLabel=''>
                          <Grid container spacing={24}>
                              <Grid item xs={12} sm={8}>
                              
                                <NumberInput
                                    id="participationFeeReduced"      
                                    type="text"
                                    disabled={readOnly}
                                    label={props.t("Reduced participation fee")}
                                    error={props.touched.participationFeeReduced && props.t(props.errors.participationFeeReduced)}
                                    value={props.values.participationFeeReduced}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    setFieldValue={props.setFieldValue}
                                  />
                              
                           </Grid>
                           <Grid item xs={12} sm={4}>
                             <CurrencyInput
                                id="participationFeeReducedCurrency"
                                type='text'
                                disabled={readOnly}
                                label={props.t("Currency")}
                                placeholder="choose a currency"
                                error={props.touched.participationFeeReducedCurrency && props.t(props.errors.participationFeeReducedCurrency)}
                                value={props.values.participationFeeReducedCurrency}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                            </Grid>
                          </Grid>
                        </FormRowLayout> 
                         <FormRowLayout infoLabel={props.t('Eligible for reduction__description')} infoLabelFullHeight>
                              <TextInput
                                id="eligibleReduction"
                                type="text"
                                disabled={readOnly}
                                label={props.t("Eligible for reduction")}
                                multiline
                                error={props.touched.eligibleReduction && props.t(props.errors.eligibleReduction)}
                                value={props.values.eligibleReduction}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                        </FormRowLayout>
                      </Panel>       
                    

                    <Panel label={props.t("erasmus_plus")}>
                         <FormRowLayout infoLabel={props.t('This activity is Erasmus+ funded__description')}>
                            <SwitchInput
                              id="erasmusIsFunded"
                              disabled={readOnly}
                              label={props.t("This activity is Erasmus+ funded")}
                              error={props.touched.erasmusIsFunded && props.t(props.errors.erasmusIsFunded)}
                              value={props.values.erasmusIsFunded}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                        </FormRowLayout>
                        <FormRowLayout infoLabel={props.t('Erasmus+ grant agreement number__description')}>
                          <TextInput
                            id="erasmusGrantAgreementNumber"
                            type="text"
                            disabled={!props.values.erasmusIsFunded || readOnly}
                            label={props.t("Erasmus+ grant agreement number")}
                            error={props.touched.erasmusGrantAgreementNumber && props.t(props.errors.erasmusGrantAgreementNumber)}
                            value={props.values.erasmusGrantAgreementNumber}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>
                        <FormRowLayout>
                          <TextInput
                            id="erasmusActivityNumber"
                            type="text"
                            disabled={!props.values.erasmusIsFunded || readOnly}
                            label={props.t("Erasmus+ activity number")}
                            error={props.touched.erasmusActivityNumber && props.t(props.errors.erasmusActivityNumber)}
                            value={props.values.erasmusActivityNumber}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>
                        
                         <FormRowLayout infoLabel={props.t('Erasmus+ activity type__description')}>
                          <TextInputSelect
                                id="erasmusActivityType"
                                type='text'
                                disabled={!props.values.erasmusIsFunded || readOnly}
                                label={props.t("Erasmus+ activity type")}
                                error={props.touched.erasmusActivityType && props.t(props.errors.erasmusActivityType)}
                                value={props.values.erasmusActivityType}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                options={['YOUTH-EXCH-P','YOUTH-EXCH-T','YOUTH-VOL-P','YOUTH-VOL-T','YOUTH-TNYW-P','YOUTH-TNYW-T', 'YOUTH-APV-EXCH', 'YOUTH-APV-EVS']}
                              />
                      </FormRowLayout>
                    </Panel>
                    
                     <Panel label={props.t("language_plural")}>
                        {
                          ((typeof props.values.mainWorkingLanguage==='string')?props.values.mainWorkingLanguage = [props.values.mainWorkingLanguage]:'')
                        }
                        <FormRowLayout infoLabel={props.t('Main working language(s)__description')}>
                        <MultiSelectInput
                                id="mainWorkingLanguage"
                                disabled={readOnly}
                                label={props.t("Main working language(s)")}
                                value={props.values.mainWorkingLanguage?props.values.mainWorkingLanguage.map((language)=>{return(language.value || language);}):props.values.mainWorkingLanguage}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                error={props.touched.mainWorkingLanguage && props.t(props.errors.mainWorkingLanguage)}
                                options={config.languages.map((language)=>{return({label:props.t(language),value:language});})}
                              />  
                        </FormRowLayout> 
                                
                    </Panel> 
                  

                     <Panel label={props.t("participant_plural")}>
                        
                        <FormRowLayout infoLabel={props.t('Does the activity have a approval/selection of applicants procedure?__description')}>
                        <CheckboxInput
                              id="hasParticipantSelectProcedure"
                              disabled={readOnly}
                              label={props.t("Does the activity have a approval/selection of applicants procedure?")}
                              error={props.touched.hasParticipantSelectProcedure && props.t(props.errors.hasParticipantSelectProcedure)}
                              value={props.values.hasParticipantSelectProcedure}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                        </FormRowLayout>
                        {/*<FormRowLayout infoLabel={props.t('Approved participants can edit their travel data and their mobility start/end__description')}>
                                                <CheckboxInput
                                                      id="canEditTravels"
                                                      label={props.t("Approved participants can edit their travel data and their mobility start/end")}
                                                      error={props.touched.canEditTravels && props.t(props.errors.canEditTravels)}
                                                      value={props.values.canEditTravels}
                                                      onChange={props.handleChange}
                                                      onBlur={props.handleBlur}
                                                    />
                                                </FormRowLayout> 
                                                <FormRowLayout infoLabel={props.t('Approved participants can edit their stays__description')}>
                                                <CheckboxInput
                                                      id="canEditStays"
                                                      label={props.t("Approved participants can edit their stays")}
                                                      error={props.touched.canEditStays && props.t(props.errors.canEditStays)}
                                                      value={props.values.canEditStays}
                                                      onChange={props.handleChange}
                                                      onBlur={props.handleBlur}
                                                    />
                                                </FormRowLayout> 
                                                *///FOR ONGEA 2.0
                                              } 
                        {/*<FormRowLayout>
                                                <CheckboxInput
                                                      id="showToName"
                                                      disabled={readOnly}
                                                      label={props.t("Participant data is shown to other participants: Profile picture, full name and nickname")}
                                                      error={props.touched.showToName && props.t(props.errors.showToName)}
                                                      value={props.values.showToName}
                                                      onChange={props.handleChange}
                                                      onBlur={props.handleBlur}
                                                    />
                                                </FormRowLayout> 
                                                <FormRowLayout>
                                                <CheckboxInput
                                                      id="showToMail"
                                                      disabled={readOnly}
                                                      label={props.t("Participant data is shown to other participants: E-mail address")}
                                                      error={props.touched.showToMail && props.t(props.errors.showToMail)}
                                                      value={props.values.showToMail}
                                                      onChange={props.handleChange}
                                                      onBlur={props.handleBlur}
                                                    />
                                                </FormRowLayout> 
                                                <FormRowLayout>
                                                <CheckboxInput
                                                      id="showToPhone"
                                                      disabled={readOnly}
                                                      label={props.t("Participant data is shown to other participants: Phone number")}
                                                      error={props.touched.showToPhone && props.t(props.errors.showToPhone)}
                                                      value={props.values.showToPhone}
                                                      onChange={props.handleChange}
                                                      onBlur={props.handleBlur}
                                                    />
                                                </FormRowLayout> 
                                                <FormRowLayout>
                                                <CheckboxInput
                                                      id="showToSkills"
                                                      disabled={readOnly}
                                                      label={props.t("Participant data is shown to other participants: Skills & interests")}
                                                      error={props.touched.showToSkills && props.t(props.errors.showToSkills)}
                                                      value={props.values.showToSkills}
                                                      onChange={props.handleChange}
                                                      onBlur={props.handleBlur}
                                                    />
                                                </FormRowLayout> */}
                                
                    </Panel> 
                    {/*<Panel label="Privacy">
                                             <FormRowLayout infoLabel={props.t("This activity is visible on:__description")} infoLabelFullHeight={true}>
                                                <SwitchInput
                                                  id="isVisible"
                                                  label={props.t("This activity is visible on:")}
                                                  error={props.touched.isVisible && props.t(props.errors.isVisible)}
                                                  value={props.values.isVisible}
                                                  onChange={props.handleChange}
                                                  onBlur={props.handleBlur}
                                                />
                                        </FormRowLayout>
                                        </Panel>*/}

            </div>
          )} />
        );
    }
}
export const Basic = BasicForm;

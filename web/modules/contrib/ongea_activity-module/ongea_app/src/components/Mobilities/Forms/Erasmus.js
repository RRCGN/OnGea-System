import React from 'react';
import Panel from '../../elements/Panel';
import EditView from '../../_Views/EditView';
import { ContentTypes } from '../../../config/content_types';
import {TextInput,CheckboxInput, SwitchInput, NumberInput, CurrencyInput, TextInputSelect,MultiSelectInput} from '../../elements/FormElements/FormElements';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import Grid from '@material-ui/core/Grid';
import {config} from '../../../config/config';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormLabel from '@material-ui/core/FormLabel';



export class ErasmusForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      periodOfStay: null
                      
     };
  }
   
  static defaultProps = {
    contentType: ContentTypes.Mobilities,
    listIdsforSelects: ['distanceBand']

  }
  
  componentDidMount(){

     this.calculatePeriodOfStay();
      
  }    
  
  
  
   calculatePeriodOfStay(){
      const {data} = this.props;
      
      if(data.dateFrom && data.dateTo){
        const dateFromObject = new Date(data.dateFrom);
        const dateToObject = new Date(data.dateTo);

        //const dateFrom = new Date(dateFromObject.getFullYear() + '-' + ("0" + (dateFromObject.getMonth() + 1)).slice(-2) + '-' + ("0" + dateFromObject.getDate()).slice(-2));
        //const dateTo = new Date(dateToObject.getFullYear() + '-' + ("0" + (dateToObject.getMonth() + 1)).slice(-2) + '-' + ("0" + dateToObject.getDate()).slice(-2));

        const periodOfStay = Math.round((dateToObject - dateFromObject)/(1000*60*60*24));
        
        this.setState({periodOfStay});
      }else{
        return "No dates where specified yet. Please fill out mobility key facts."
      }
   }


  

    render() {

    
   
    const {periodOfStay} = this.state;
    const readOnly=this.props.readOnly;
    console.log('read',readOnly);
console.log('rtrt',this.props);
       return (
           <EditView {...this.props} render={(props,{selectOptions}) => (

           <div>

                 <Panel label="Specific information for Erasmus+">
                 <FormRowLayout>
                          <CheckboxInput
                                id="accompanyingPerson"
                                disabled={readOnly}
                                label={props.t("Accompanying person for participant with special needs")}
                                error={props.touched.accompanyingPerson && props.errors.accompanyingPerson}
                                value={props.values.accompanyingPerson}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                        </FormRowLayout>
                      <FormRowLayout infoLabel={props.t("Participant with special needs__description")}>
                          <SwitchInput
                                id="participantSpecial"
                                disabled={readOnly}
                                label={props.t("Participant with special needs")}
                                error={props.touched.participantSpecial && props.errors.participantSpecial}
                                value={props.values.participantSpecial}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                        </FormRowLayout>
                        <FormRowLayout infoLabel={props.t("Participation fee__description")}>
                          <Grid container spacing={24}>
                            <Grid item xs={12} sm={6}>
                              
                                <NumberInput
                                  id="euGrantSpecial"
                                  type="text"
                                  disabled={!props.values.participantSpecial || readOnly}
                                  label={props.t("EU grant for participants with special needs")}
                                  error={props.touched.euGrantSpecial && props.errors.euGrantSpecial}
                                  value={props.values.euGrantSpecial}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  setFieldValue={props.setFieldValue}
                                />
                              
                           </Grid>
                           <Grid item xs={12} sm={6}>
                             <CurrencyInput
                                id="euGrantSpecialCurrency"
                                disabled={!props.values.participantSpecial || readOnly}
                                type='text'
                                label={props.t("Currency")}
                                error={props.touched.euGrantSpecialCurrency && props.errors.euGrantSpecialCurrency}
                                value={props.values.euGrantSpecialCurrency}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                         </Grid>
                      </Grid>
                    </FormRowLayout> 
                        
                </Panel>



              <Panel>
                        <FormRowLayout infoLabel={props.t("Participant with fewer opportunities__description")}>
                          <CheckboxInput
                                id="participantWithFewerOppurtunities"
                                disabled={readOnly}
                                label={props.t("Participant with fewer opportunities")}
                                error={props.touched.participantWithFewerOppurtunities && props.errors.participantWithFewerOppurtunities}
                                value={props.values.participantWithFewerOppurtunities}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                        </FormRowLayout>
                </Panel>



              <Panel>

                        <FormRowLayout>
                          <CheckboxInput
                                id="groupLeader"
                                disabled={readOnly}
                                label={props.t("Group leader / trainer")}
                                error={props.touched.groupLeader && props.errors.groupLeader}
                                value={props.values.groupLeader}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                        </FormRowLayout>

                </Panel>



              <Panel>

                <FormRowLayout infoLabel={props.t("Distance band__description")}>
                          <TextInputSelect
                                id="distanceBand"
                                disabled={selectOptions.distanceBand && !readOnly ? false : true}
                                type='text'
                                label={props.t("Distance band")}
                                error={props.touched.distanceBand && props.errors.distanceBand}
                                value={props.values.distanceBand}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                options={selectOptions.distanceBand ? selectOptions.distanceBand : []}
                              />
                           {selectOptions.distanceBand ? null : <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}

                </FormRowLayout>

                </Panel>



             {/* <Panel>
                             
                                     <FormRowLayout infoLabel={props.t('Main working language(s)__description')}>
                                     <MultiSelectInput
                                             id="language"
                                             disabled={readOnly}
                                             label={props.t("Main working language(s)")}
                                             value={props.values.language ? props.values.language.constructor === Array ? props.values.language.map((language)=>{return(language.value || language);}) : [props.values.language] :null}
                                             onChange={props.handleChange}
                                             onBlur={props.handleBlur}
                                             error={props.touched.language && props.errors.language}
                                             options={config.languages.map((language)=>{return({label:language,value:language});})}
                                           />  
                                     </FormRowLayout> 
                             </Panel>*/}



              <Panel>
                    <FormRowLayout infoLabel={props.t("Exceptional costs__description")}>
                          <Grid container spacing={24}>
                            <Grid item xs={12} sm={6}>
                              
                                <NumberInput
                                  id="exceptionalCosts"
                                  disabled={readOnly}
                                  type="text"
                                  label={props.t("Exceptional costs")}
                                  error={props.touched.exceptionalCosts && props.errors.exceptionalCosts}
                                  value={props.values.exceptionalCosts}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  setFieldValue={props.setFieldValue}
                                />
                              
                           </Grid>
                           <Grid item xs={12} sm={6}>
                             <CurrencyInput
                                id="exceptionalCostsCurrency"
                                disabled={readOnly}
                                type='text'
                                label={props.t("Currency")}
                                error={props.touched.exceptionalCostsCurrency && props.errors.exceptionalCostsCurrency}
                                value={props.values.exceptionalCostsCurrency}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                         </Grid>
                      </Grid>
                    </FormRowLayout> 
              <FormRowLayout infoLabel={props.t("EU Travel grant NOT required__description")}>
                          <CheckboxInput
                                id="euTravelGrantNotRequired"
                                disabled={readOnly}
                                label={props.t("EU Travel grant NOT required")}
                                error={props.touched.euTravelGrantNotRequired && props.errors.euTravelGrantNotRequired}
                                value={props.values.euTravelGrantNotRequired}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
               </FormRowLayout>
               <FormRowLayout infoLabel={props.t("EU individual support grant NOT required__description")}>
                          <CheckboxInput
                                id="euIndividualSupportGrantNotRequired"
                                disabled={readOnly}
                                label={props.t("EU individual support grant NOT required")}
                                error={props.touched.euIndividualSupportGrantNotRequired && props.errors.euIndividualSupportGrantNotRequired}
                                value={props.values.euIndividualSupportGrantNotRequired}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
               </FormRowLayout>
               <FormRowLayout infoLabel={props.t("EU organisational support grant NOT required__description")}>
                          <CheckboxInput
                                id="euOrganisationalSupportGrantNotRequired"
                                disabled={readOnly}
                                label={props.t("EU organisational support grant NOT required")}
                                error={props.touched.euOrganisationalSupportGrantNotRequired && props.errors.euOrganisationalSupportGrantNotRequired}
                                value={props.values.euOrganisationalSupportGrantNotRequired}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
               </FormRowLayout>

            </Panel>



              <Panel>
                <FormRowLayout infoLabel={props.t("Explanation for non-standard travels__description")}>
                              <TextInput
                                id="whenTravellingTo"
                                disabled={readOnly}
                                type="text"
                                label={props.t("Explanation for non-standard travels")}
                                multiline
                                rows={5}
                                error={props.touched.whenTravellingTo && props.errors.whenTravellingTo}
                                value={props.values.whenTravellingTo ? (props.values.whenTravellingTo.value || props.values.whenTravellingTo) : ''}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                 </FormRowLayout>
             </Panel>



              <Panel>       
                 
                  <FormRowLayout infoLabel={props.t("calculated from form: mobilities key facts.")}>
                  <br/>
                  <FormLabel>{props.t("Total Number of days in this mobility: ")+periodOfStay+' day'+(periodOfStay>1 ? 's' : '')}</FormLabel>
                  </FormRowLayout>
                  
                 <FormRowLayout infoLabel={props.t("How many days count as travel days?__description")}>
                     <NumberInput
                                  id="howManyDaysCount"
                                  disabled={readOnly}
                                  type="text"
                                  label={props.t("How many days count as travel days?")}
                                  error={props.touched.howManyDaysCount && props.errors.howManyDaysCount}
                                  value={props.values.howManyDaysCount}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  setFieldValue={props.setFieldValue}
                                />
                   </FormRowLayout>
                   <FormRowLayout infoLabel={props.t("Missed days__description")}>
                     <NumberInput
                                  id="inCaseOfInterruption"
                                  disabled={readOnly}
                                  type="text"
                                  label={props.t("Missed days")}
                                  error={props.touched.inCaseOfInterruption && props.errors.inCaseOfInterruption}
                                  value={props.values.inCaseOfInterruption}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  setFieldValue={props.setFieldValue}
                                />
                   </FormRowLayout>
                   <FormRowLayout infoLabel={props.t("How many days without funding?__description")}>
                     <NumberInput
                                  id="howManyDaysWithoutFunding"
                                  disabled={readOnly}
                                  type="text"
                                  label={props.t("How many days without funding?")}
                                  error={props.touched.howManyDaysWithoutFunding && props.errors.howManyDaysWithoutFunding}
                                  value={props.values.howManyDaysWithoutFunding}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  setFieldValue={props.setFieldValue}
                                />
                   </FormRowLayout>

                   <FormRowLayout infoLabel={props.t("Participant couldn’t stay for the full planned activity due to force majeure?__description")}>
                          <CheckboxInput
                                id="participantCouldntStay"
                                disabled={readOnly}
                                label={props.t("Participant couldn’t stay for the full planned activity due to force majeure?")}
                                error={props.touched.participantCouldntStay && props.errors.participantCouldntStay}
                                value={props.values.participantCouldntStay}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                  </FormRowLayout>
                   <FormRowLayout>
                              <TextInput
                                id="explanationCase"
                                disabled={readOnly}
                                type="text"
                                label={props.t("Explanation for that case of force majeure")}
                                multiline
                                rows={7}
                                error={props.touched.explanationCase && props.errors.explanationCase}
                                value={props.values.explanationCase ? (props.values.explanationCase.value || props.values.explanationCase) : ''}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                 </FormRowLayout>
                 
                </Panel>



              <Panel>
              <FormRowLayout infoLabel={props.t("Group of participants__description")}>
                              <TextInput
                                id="groupOfParticipants"
                                disabled={readOnly}
                                type="text"
                                label={props.t("Group of participants")}
                                error={props.touched.groupOfParticipants && props.errors.groupOfParticipants}
                                value={props.values.groupOfParticipants}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                 </FormRowLayout>
                  
        </Panel>
        

            </div>
          )} />
        );
    }
}

export const Erasmus = ErasmusForm;

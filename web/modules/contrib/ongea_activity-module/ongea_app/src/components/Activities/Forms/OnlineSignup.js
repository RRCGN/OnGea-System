import React from 'react';
import Panel from '../../elements/Panel';
import EditView from '../../_Views/EditView';
import { ContentTypes } from '../../../config/content_types';

import {SwitchInput, RadioInput} from '../../elements/FormElements/FormElements';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import CircularProgress from '@material-ui/core/CircularProgress';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Radio from '@material-ui/core/Radio';

 



export class OnlineSignupForm extends React.Component {
   
// This is a SubForm of activities Form, so slightly different props are set.
constructor(props) {
        super(props);
    
        this.state = {
              data:this.props.data.signUpForm,
              sendingOrgId:null
        };
      }
  


  static defaultProps = {
    contentType: ContentTypes.ActivitiesForm,
    parentContentType: ContentTypes.Activities,
    listIdsforSelects: ['whoCanSee', "signUpFormSettings", "signUpFormFieldSettings"]
  }
  
  componentDidMount() {

    if(!this.state.data || this.state.data === {}){

      this.setInitialValues();

    }

  }

  componentWillReceiveProps(newProps) {
      if(newProps.data && newProps.data !== this.props.data){
        this.setState({data:newProps.data.signUpForm});
      }
  }
 
 setInitialValues = () => {

        
              var data = {
                  signupIsActive:false,
                  whoCanSee:'sign-up form available for everyone, filling it doesn’t create user profile'
                  

              };
              
              this.setState({data});
      }
  


    render() {

      const {data,
        ...props} = this.props;
      const readOnly = this.props.readOnly;
     
      const matrixData = [
          {id:'signupNickname', label:'Artist name / nick name'},
          {id:'signupBirthday', label:'Birth date'},
          {id:'signupGender', label:'Gender'},
          {id:'signupAboutme', label:'About me'}, 
          {id:'signupStreet', label:'Street address'}, 
          {id:'signupPostcode', label:'Postal code'}, 
          {id:'signupTown', label:'City'}, 
          {id:'signupRegion', label:'Region'},
          {id:'signupCountry', label:'Country of Residency'}, 
          {id:'signupPhone', label:'(Mobile) phone'}, 
          {id:'signupPassId', label:'ID document number'}, 
          {id:'signupIssuedOn', label:'Issued on'}, 
          {id:'signupExpiresOn', label:'Expires on'}, 
          {id:'signupNationality', label:'Nationality'}, 
          {id:'signupWebsite', label:'Homepage / social media profile'}, 
          {id:'signupProfilePic', label:'Profile picture'}, 
          {id:'signupEmergencyContact', label:'Emergency contact name'},
          {id:'signupEmergencyPhone', label:'Emergency contact phone number (mobile)'}, 
          {id:'signupSkills', label:'Skills and interests'}, 
          {id:'signupFoodOptions', label:'I eat'}, 
          {id:'signupFoodRequirements', label:'Additional food requirements'}, 
          {id:'signupSkillsRelated', label:'Skills and interests for this activity'}, 
          {id:'signupSkillsDetails', label:'Skills and interests details'}, 
          {id:'signupExampleOf', label:'Link to example of own practice related to these skills and interests'}, 
          {id:'signupMotiviation', label:'What is your motivation to participate in this activity?'}, 
          {id:'signupHearAbout', label:'How did you hear about this activity?'}, 
          {id:'signupRoomRequirements', label:'Room requirements'}, 
          {id:'signupCanShare', label:'Can share with'},
          {id:'signupSpecialaccomodation', label:'Special accommodation requirements'}, 
          {id:'signupMedicalrequirements', label:'Medical and other specific requirements'}
      ];

       return (
           <EditView data={this.state.data} isSubForm={true} parentDataID={data.id} parentData={data} {...props} render={(props, {selectOptions}) => (

              <div>
                    <Panel label={props.t("Online sign-up form")}>
                         <FormRowLayout infoLabel={props.t("Online sign-up form__description")} infoLabelFullHeight={true}>
                            <SwitchInput
                              id="signupIsActive"
                              disabled={readOnly}
                              name="signupIsActive"
                              label={props.t("Online sign-up form")}
                              error={props.error}
                              value={props.values.signupIsActive}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                            />
                        </FormRowLayout>

                        
                    </Panel>

                  
                     <Panel label=''>
                         <FormRowLayout>
                            
                            {selectOptions.whoCanSee ?
                            <RadioInput
                              id="whoCanSee"
                              name="whoCanSee"
                              disabled={!props.values.signupIsActive || readOnly}
                              label={props.t("Who can see and fill a sign-up form?")}
                              value={props.values.whoCanSee || (selectOptions.whoCanSee && selectOptions.whoCanSee[2].value)}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              setFieldValue={props.setFieldValue}
                              options={selectOptions.whoCanSee ? selectOptions.whoCanSee.map((setting)=>{return({ value:setting.value, label: props.t(setting.label) })}) : []}
                            />
                             : <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}

    
                        </FormRowLayout>
                    </Panel>

                   {/*<Panel label=''>
                         <FormRowLayout>
                           {selectOptions.showSignup ? 
                            <RadioInput
                              id="showSignup"
                              name="showSignup"
                              label={props.t("Show this sign-up form:")}
                              disabled={props.values.signupIsActive && selectOptions.showSignup ? false : true}
                              value={props.values.showSignup || (selectOptions.showSignup && selectOptions.showSignup[0])}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              setFieldValue={props.setFieldValue}
                              options={selectOptions.showSignup ? selectOptions.showSignup.map((setting)=>{return({value:setting.value,label:props.t(setting.label)})}) : []}

                            />
                          : <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                        </FormRowLayout>
                    </Panel>*/}

                    {/*<Panel label=''>
                                             <FormRowLayout>
                                              {selectOptions.signUpFormSettings ?
                                                <RadioInput
                                                  id="assigningOrgs"
                                                  name="assigningOrgs"
                                                  label={props.t("Settings for assigning sending organisations")}
                                                  disabled={props.values.signupIsActive && selectOptions.signUpFormSettings ? false : true}
                                                  value={(props.values.assigningOrgs) || (selectOptions.signUpFormSettings && selectOptions.signUpFormSettings[1].value)}
                                                  onChange={props.handleChange}
                                                  onBlur={props.handleBlur}
                                                  setFieldValue={props.setFieldValue}
                                                  options={selectOptions.signUpFormSettings ? selectOptions.signUpFormSettings.map((setting)=>{return({value:setting.value,label:props.t(setting.label)})}) : []}
                                                />
                                            : <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}

    
                        </FormRowLayout>
                    </Panel>*/}

                    <Panel label={props.t('adjust_signup_form')}>
                         
                          <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell></TableCell>
                                  {selectOptions.signUpFormFieldSettings ? selectOptions.signUpFormFieldSettings.map((setting)=>{
                                    return(<TableCell key={setting.value}>{props.t(setting.label)}</TableCell>);

                                  }): null}
                                  
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                
                                  {matrixData.map(
                                    (row) => {
                                      var hideRow=false;
                                      if(row.id==='signupSkills'||row.id==='signupSkillsRelated'){
                                        hideRow=true;
                                        if(props.values.signupSkills !== 'off'){
                                          props.setFieldValue('signupSkills','off');
                                        }
                                        if(props.values.signupSkillsRelated !== 'off'){
                                          props.setFieldValue('signupSkillsRelated','off');
                                        }
                                        
                                        
                                        
                                      }
                                        return(
                                         !hideRow && <TableRow key={row.id}>
                                                                               <TableCell component="th" scope="row"> 
                                                                                 {props.t(row.label)}
                                                                               </TableCell>
                                                                               {selectOptions.signUpFormFieldSettings ? selectOptions.signUpFormFieldSettings.map((setting)=>{
                                                                                   
                                                                                   return(
                                                                                     <TableCell key={row.id+'-'+setting.value}>
                                                                                       <Radio
                                                                                             checked={(setting.value === "off" && !props.values[row.id]) || props.values[row.id] === setting.value}
                                                                                             disabled={!props.values.signupIsActive || readOnly}
                                                                                             onChange={props.handleChange}
                                                                                             value={setting.value}
                                                                                             name={row.id}
                                                                                             aria-label={setting.label}
                                                                                         />
                                                                                     </TableCell>
                                                                                   );
                                                                               }): null}
                                                                               
                                                                             </TableRow>);
                                    }
                                  )}
                                   
                                  
                                
                              </TableBody>
                              <TableHead>
                                <TableRow>
                                  <TableCell></TableCell>
                                  {selectOptions.signUpFormFieldSettings ? selectOptions.signUpFormFieldSettings.map((setting)=>{

                                    return(<TableCell key={setting.value}>{setting.label}</TableCell>);

                                  }): null}
                                  
                                </TableRow>
                              </TableHead>
                            </Table>    


                           
                            
    
                        
                    </Panel>
                   
                     

                     {/*props.values.signupIsActive && 
                      <Panel label={props.t('external_signup_form')}>
                        
                        
                        
                        
                        <br />
                        <FormRowLayout infoLabel=''>
                                                <SelectInput
                                                  id="sendingOrgId"
                                                  type="text"
                                                  
                                                  label={props.t("external_signup_sending_org")}
                                                  
                                                  value={this.state.sendingOrgId}
                                                  onChange={(event)=>{

                                                    this.setState({sendingOrgId:event.target.value});
                                                  }}
                                                  onBlur={(event)=>{
                                                  
                                                    
                                                  }}
                                                  
                                                  options={props.parentData && props.parentData.organisations ? props.parentData.organisations.map((org)=>({value:org.id,label:org.title})) :[]}
                                                />
                                                
                                                </FormRowLayout>

                        <br />{props.t('external_signup_explanation')}<br /><br />
                        <pre>

                        <code>
                        &lt;script src=&quot;{config.baseUrl}/modules/contrib/ongea_registration_form/RegistrationForm/build/static/js/main.js&quot;&gt;&lt;/script&gt;<br />
                        &lt;div data-appName=&quot;[your app name]&quot; data-sendingorganisationId=&quot;{this.state.sendingOrgId || ''}&quot; data-activityid=&quot;{props.parentDataID}&quot; data-appLoginUrl=&quot;{config.baseUrl}/node/{props.parentDataID}&quot; data-basePath=&quot;{config.baseUrl}&quot; data-lang=&quot;{props.i18n ? props.i18n.language : 'en'}&quot; data-langPath=&quot;/modules/contrib/ongea_activity-module/ongea_app/build/locales/&quot; id=&quot;ongea_activity_signupform&quot;&gt;&lt;/div&gt;
                        <script src="[host]/modules/contrib/ongea_registration_form/RegistrationForm/build/static/js/main.js"></script>
                        </code>
                        </pre>

                     </Panel>*/}
               
              
                
            </div>
            
          )} />
        );
    }
}
export const OnlineSignup = OnlineSignupForm;

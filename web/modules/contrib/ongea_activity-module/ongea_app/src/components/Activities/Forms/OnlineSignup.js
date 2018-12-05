import React from 'react';
import Panel from '../../elements/Panel';
import EditView from '../../_Views/EditView';
import { ContentTypes } from '../../../config/content_types';

import {SwitchInput, RadioInput, SelectInput} from '../../elements/FormElements/FormElements';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import CircularProgress from '@material-ui/core/CircularProgress';
import {config} from '../../../config/config';

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
          {id:'signupNickname', label:'Nickname'},
          {id:'signupBirthday', label:'Birthdate'},
          {id:'signupGender', label:'Gender'},
          {id:'signupAboutme', label:'About me'}, 
          {id:'signupStreet', label:'Street'}, 
          {id:'signupPostcode', label:'Postcode'}, 
          {id:'signupTown', label:'Town'}, 
          {id:'signupRegion', label:'Region'},
          {id:'signupCountry', label:'Country'}, 
          {id:'signupPhone', label:'Phone'}, 
          {id:'signupPassId', label:'Passport ID'}, 
          {id:'signupIssuedOn', label:'issued on'}, 
          {id:'signupExpiresOn', label:'expires on'}, 
          {id:'signupNationality', label:'Nationality'}, 
          {id:'signupWebsite', label:'Homepage / Social Media Profile'}, 
          {id:'signupProfilePic', label:'Profile picture'}, 
          {id:'signupEmergencyContact', label:'Emergency Contact Name'},
          {id:'signupEmergencyPhone', label:'Emergency Contact Phone number (mobile)'}, 
          {id:'signupSkills', label:'Skills and interests'}, 
          {id:'signupExampleOf', label:'Example of skills and interests'}, 
          {id:'signupFoodOptions', label:'I eat'}, 
          {id:'signupFoodRequirements', label:'Additional food requirements'}, 
          {id:'signupSkillsRelated', label:'Skills and interests related to this activity'}, 
          {id:'signupSkillsDetails', label:'Skills and interests details'}, 
          {id:'signupMotiviation', label:'What is your motivation to participate in this project?'}, 
          {id:'signupHearAbout', label:'How did you hear about this project?'}, 
          {id:'signupRoomRequirements', label:'Room requirements'}, 
          {id:'signupCanShare', label:'Can share with'},
          {id:'signupSpecialaccomodation', label:'Special accomodation'}, 
          {id:'signupMedicalrequirements', label:'Medical requirements'}
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

                    <Panel label='Adjust sign-up form'>
                         
                          <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell></TableCell>
                                  {selectOptions.signUpFormFieldSettings ? selectOptions.signUpFormFieldSettings.map((setting)=>{
                                    return(<TableCell key={setting.value}>{setting.label}</TableCell>);

                                  }): null}
                                  
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                
                                  {matrixData.map(
                                    (row) => {
                                        return(
                                         <TableRow key={row.id}>
                                      <TableCell component="th" scope="row"> 
                                        {row.label}
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
                   
                     

                     {props.values.signupIsActive && 
                      <Panel label='External Signup Form'>
                        
                        
                        
                        
                        <br />
                        <FormRowLayout infoLabel=''>
                                                <SelectInput
                                                  id="sendingOrgId"
                                                  type="text"
                                                  
                                                  label={props.t("Choose sending organisation (optional)")}
                                                  
                                                  value={this.state.sendingOrgId}
                                                  onChange={(event)=>{

                                                    this.setState({sendingOrgId:event.target.value});
                                                  }}
                                                  onBlur={(event)=>{
                                                  
                                                    
                                                  }}
                                                  
                                                  options={props.parentData && props.parentData.organisations ? props.parentData.organisations.map((org)=>({value:org.id,label:org.title})) :[]}
                                                />
                                                
                                                </FormRowLayout>

                        <br />To include the SignUp form on your remote site please add the following snippet to your HTML.<br /><br />
                        <pre>

                        <code><script src="[host]/modules/contrib/ongea_registration_form/RegistrationForm/build/static/js/main.js"></script>
                        &lt;script src=&quot;{config.baseUrl}/modules/contrib/ongea_registration_form/RegistrationForm/build/static/js/main.js&quot;&gt;&lt;/script&gt;<br />
                        &lt;div data-appName=&quot;[your app name]&quot; data-sendingorganisationId=&quot;{this.state.sendingOrgId || ''}&quot; data-activityid=&quot;{props.parentDataID}&quot; data-appLoginUrl=&quot;{config.baseUrl}/node/{props.parentDataID}&quot; data-basePath=&quot;{config.baseUrl}&quot; data-lang=&quot;{props.i18n ? props.i18n.language : 'en'}&quot; id=&quot;ongea_activity_signupform&quot;&gt;&lt;/div&gt;
                        
                        </code>
                        </pre>

                     </Panel>}
               
              
                
            </div>
            
          )} />
        );
    }
}
export const OnlineSignup = OnlineSignupForm;

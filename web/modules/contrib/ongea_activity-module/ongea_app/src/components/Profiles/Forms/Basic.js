import React from 'react';
import Panel from '../../elements/Panel';
import EditView from '../../_Views/EditView';
import { ContentTypes } from '../../../config/content_types';
import {TextInput, DateInput,CheckboxInput,SwitchInput, LanguagesInput, SelectInput, CountryInput, TextInputSelect, TelephoneInput} from '../../elements/FormElements/FormElements';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import CircularProgress from '@material-ui/core/CircularProgress';
import FileUpload from '../../elements/FormElements/FileUpload';
import { config } from '../../../config/config';


 
 

export class BasicForm extends React.Component {
   
 constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
       emailHasAccount:false           
     };
     this._isMounted=false;
  }
 

  static defaultProps = {
    contentType: ContentTypes.Profiles,
    listIdsforSelects: ['gender','foodOptions','skillsAndInterests']

  }


  
  componentWillUnmount() {
    this._isMounted=false;
   }

  componentDidMount() {
      this._isMounted=true;
     
     if((this.props.match && this.props.match.params.id === "new") || (this.props.isReference && this.props.referenceId === "new")){

      this.setInitialValues();


    }

  }

  componentWillReceiveProps(newProps) {
      if(newProps.data && newProps.data !== this.props.data){
        this.setState({data:newProps.data});
      }
  }


  validateEmail = (value) => {
    const isOriginalEmail = value && this.props.data && value === this.props.data.mail;
    
    if(value && !isOriginalEmail){
          fetch(config.baseUrl+'/check-email/'+value)
                  .then((response) => {
                    return response.json();
                  })
                  .then((result)=>{
                    
                      if(result.user === true){
                        this.setState({emailHasAccount:true});                        
                      }else{
                        this.setState({emailHasAccount:false}); 
                      }
                  })
                  .catch((error) => {
                    
                    console.error(error);
                  });
   }

  }

  
  
  setInitialValues = () => {

        
              var data = {
                firstname:null,
                lastname:null,
                nickname:null,
                gender:null,
                birthDate:null,
                street:null,
                postcode:null,
                town:null,
                region:null,
                country:null,
                phone:null,
                mail:null,
                website:null,
                emergencyContact:null,
                emergencyContactPhone:null,
                passId:null,
                ispassport:false,
                issuedOn:null,
                expiresOn:null,
                nationality:null,
                visainvitation:false,
                schengenvisa:null,
                visaexpiry:null,
                aboutme:null,
                profilePicture:null,
                skillsAndInterests:null,
                skillsAndInterestsDetails:null,
                expieriencesRelated:null,
                linkToExample:null,
                languages:null,
                iEat:null,
                foodRequirements:null,
                medicalRequirements:null,
                showMyProfile:true,
                showMyMail:false,
                showMyName:false,
                showMyPhone:false,
                showMyAddress:false,
                notifyParticipant:false
              };
              
              this.setState({data});
      }
  

    render() {
    const {data, ...props} = this.props;
    const {emailHasAccount} = this.state;
    
    

    var isNew = false;
    
   if((this.props.match && this.props.match.params.id === "new") || (this.props.isReference && this.props.referenceId === "new")){
    isNew = true;
   }

       return (
           <EditView data={this.state.data} {...props} render={(props,{selectOptions}) => {


            for(var selectKey in selectOptions){
              const select = selectOptions[selectKey];
              for(var option of select){
                if(option.label){
                  option.label = props.t(option.label);
                }
              }
            }

           return (

            <div>
  
              

                   <Panel label={props.t("basic_information")}>
                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="firstname"
                            disabled={props.readOnly}
                            type="text"
                            label={props.t("First name(s)")}
                            error={props.touched.firstname && props.t(props.errors.firstname)}
                            value={props.values.firstname}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="lastname"
                            disabled={props.readOnly}
                            type="text"
                            label={props.t("Family name(s)")}
                            error={props.touched.lastname && props.t(props.errors.lastname)}
                            value={props.values.lastname}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="nickname"
                            disabled={props.readOnly}
                            type="text"
                            label={props.t("Artist name / nick name")}
                            error={props.touched.nickname && props.t(props.errors.nickname)}
                            value={props.values.nickname}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 

                        <FormRowLayout infoLabel=''>
                          <TextInputSelect
                                id="gender"
                                type='text'
                                disabled={!props.readOnly && selectOptions.gender ? false : true}
                                label={props.t("Gender")}
                                error={props.touched.gender && props.t(props.errors.gender)}
                                value={props.values.gender}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                options={selectOptions.gender ? selectOptions.gender : []}
                              />
                           {selectOptions.gender ? null : <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}

                      </FormRowLayout>
                      <FormRowLayout infoLabel=''>
                      <DateInput
                            id="birthDate"
                            disabled={props.readOnly}
                            label={props.t("Birth date")}
                            error={props.touched.birthDate && props.t(props.errors.birthDate)}
                            value={props.values.birthDate}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur} 
                          />
                      </FormRowLayout>
                        
                  </Panel>

                  <Panel label={props.t("address")}>
                        

                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="street"
                            disabled={props.readOnly}
                            type="text"
                            label={props.t("Street address")}
                            error={props.touched.street && props.t(props.errors.street)}
                            value={props.values.street}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>                          
                      <FormRowLayout infoLabel=''>
                          <TextInput
                            id="postcode"
                            disabled={props.readOnly}
                            type="text"
                            label={props.t("Postal code")}
                            error={props.touched.postcode && props.t(props.errors.postcode)}
                            value={props.values.postcode}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 
                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="town"
                            disabled={props.readOnly}
                            type="text"
                            label={props.t("City")}
                            error={props.touched.town && props.t(props.errors.town)}
                            value={props.values.town}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout>
                        
                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="region"
                            type="text"
                            disabled={props.readOnly}
                            label={props.t("Region")}
                            error={props.touched.region && props.t(props.errors.region)}
                            value={props.values.region}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 
                        <FormRowLayout infoLabel=''>
                          <CountryInput
                                    id="country"
                                    disabled={props.readOnly}
                                    type='text'
                                    label={props.t("Country of Residency")}
                                    error={props.touched.country && props.t(props.errors.country)}
                                    value={props.values.country || ''}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    setFieldValue={props.setFieldValue}
                                  />
                        </FormRowLayout> 
                      </Panel>
                      <Panel label={props.t("contact_data")}>

                      <FormRowLayout infoLabel=''>
                          <TelephoneInput
                            id="phone"
                            type="text"
                            disabled={props.readOnly}
                            label={props.t("(Mobile) phone")}
                            error={props.touched.phone && props.t(props.errors.phone)}
                            value={props.values.phone}
                            onChange={props.handleChange}
                            setFieldTouched={props.setFieldTouched}
                            setFieldValue={props.setFieldValue}
                          />
                        </FormRowLayout> 
                        
                        <FormRowLayout >
                          <TextInput
                            id="mail"
                            disabled={props.readOnly}
                            type="text"
                            label={props.t("E-mail address")}
                            error={props.touched.mail && props.t(props.errors.mail)}
                            value={props.values.mail}
                            onChange={props.handleChange}
                            onBlur={(event)=>{ 
                              this.validateEmail(event.target.value);
                              if(isNew) props.setFieldValue('notifyParticipant',document.getElementById('notifyParticipant').checked);
                              props.handleBlur(event);
                            }}
                          />
                          {emailHasAccount && !props.errors.mail && <div className="ongeaAct__inputField-warning">{props.t('email_exists_drupal')}</div>}
                        </FormRowLayout> 
                         {isNew && <FormRowLayout infoLabel={props.t("Send notification to participant__description")}>
                                                   <CheckboxInput
                                                         id="notifyParticipant"
                                                         disabled={!props.values.mail || !!props.errors.mail || props.readOnly}
                                                         label={props.t("Send notification to participant")}
                                                         error={props.touched.notifyParticipant && props.t(props.errors.notifyParticipant)}
                                                         value={!props.values.notifyParticipant || !!props.errors.mail || !props.values.mail ? false : props.values.notifyParticipant}
                                                         onChange={props.handleChange}
                                                         onBlur={props.handleBlur}
                                                       />
                                                   
                                           </FormRowLayout>}
                        <FormRowLayout infoLabel=''>
                          <TextInput
                            id="website"
                            type="text"
                            disabled={props.readOnly}
                            label={props.t("Homepage / social media profile")}
                            error={props.touched.website && props.t(props.errors.website)}
                            value={props.values.website}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 
                  </Panel>

                  <Panel label={props.t("emergency_contact")}>
                         <FormRowLayout infoLabel=''>
                          <TextInput
                            id="emergencyContact"
                            type="text"
                            disabled={props.readOnly}
                            label={props.t("Emergency contact name")}
                            error={props.touched.emergencyContact && props.t(props.errors.emergencyContact)}
                            value={props.values.emergencyContact}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </FormRowLayout> 
                        
                        <FormRowLayout infoLabel=''>
                          
                           <TelephoneInput
                            id="emergencyContactPhone"
                            type="text"
                            disabled={props.readOnly}
                            label={props.t("Emergency contact phone number (mobile)")}
                            error={props.touched.emergencyContactPhone && props.t(props.errors.emergencyContactPhone)}
                            value={props.values.emergencyContactPhone}
                            onChange={props.handleChange}
                            setFieldTouched={props.setFieldTouched}
                            setFieldValue={props.setFieldValue}
                          />
                        </FormRowLayout> 
                        
                        
                        
                  </Panel>
                    
                    

                  {/*IDDOCUMENT */} 
                  <Panel label={props.t("passport_data")}>
                  <FormRowLayout infoLabel=''>
                                <TextInput
                                  id="passId"
                                  type="text"
                                  disabled={props.readOnly}
                                  label={props.t("ID document number")}
                                  error={props.touched.passId && props.t(props.errors.passId)}
                                  value={props.values.passId}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                />
                  </FormRowLayout> 
                  <FormRowLayout>
                          <CheckboxInput
                                id="ispassport"
                                disabled={props.readOnly}
                                label={props.t("ID document is a passport")}
                                error={props.touched.ispassport && props.t(props.errors.ispassport)}
                                value={props.values.ispassport}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                        </FormRowLayout>
                        <FormRowLayout>
                              <DateInput
                                    id="issuedOn"
                                    disabled={props.readOnly}
                                    label={props.t("Issued on")}
                                    error={props.touched.issuedOn && props.t(props.errors.issuedOn)}
                                    value={props.values.issuedOn}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                  />
                       </FormRowLayout>
                       <FormRowLayout>
                              <DateInput
                                    id="expiresOn"
                                    label={props.t("Expires on")}
                                    disabled={props.readOnly}
                                    error={props.touched.expiresOn && props.t(props.errors.expiresOn)}
                                    value={props.values.expiresOn}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                  />
                       </FormRowLayout>
                       <FormRowLayout infoLabel=''>
                                
                                <CountryInput
                                    id="nationality"
                                    disabled={props.readOnly}
                                    type='text'
                                    label={props.t("Nationality")}
                                    error={props.touched.nationality && props.t(props.errors.nationality)}
                                    value={props.values.nationality || ''}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    setFieldValue={props.setFieldValue}
                                  />
                  </FormRowLayout> 
                </Panel>
                 <Panel label={props.t('visa_information')}>
                 <FormRowLayout infoLabel={props.t("Invitation letter for visa needed__description")}>
                          <CheckboxInput
                                id="visainvitation"
                                disabled={props.readOnly}
                                label={props.t("Invitation letter for visa needed")}
                                error={props.touched.visainvitation && props.t(props.errors.visainvitation)}
                                value={props.values.visainvitation}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                    </FormRowLayout>
                  <FormRowLayout>
                          <SwitchInput
                                id="schengenvisa"
                                disabled={props.readOnly}
                                label={props.t("I have a Schengen visa")}
                                error={props.touched.schengenvisa && props.t(props.errors.schengenvisa)}
                                value={props.values.schengenvisa}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                    </FormRowLayout>
                     <FormRowLayout>
                          <DateInput
                                id="visaexpiry"
                                label={props.t("Expires on")}
                                disabled={props.readOnly || !props.values.schengenvisa}
                                error={props.touched.visaexpiry && props.t(props.errors.visaexpiry)}
                                value={props.values.visaexpiry}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                   </FormRowLayout>
                  
              </Panel>

            {/*ABOUT*/}

            <Panel label={props.t("about_me")}>
                  <FormRowLayout>
                        <TextInput
                          id="aboutme"
                          disabled={props.readOnly}
                          type="text"
                          label={props.t("About me")}
                          multiline
                          rows={6}
                          error={props.touched.aboutme && props.t(props.errors.aboutme)}
                          value={props.values.aboutme}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                        />
                  </FormRowLayout>
                  <FormRowLayout infoLabel={props.t("Profile picture__description")} infoLabelFullHeight>
                            <FileUpload 
                                id="profilePicture"
                                disabled={props.readOnly}
                                label={props.t("Profile picture")}
                                snackbar={props.snackbar} 
                                accept={'image/jpeg, image/png, image/gif'}
                                text={props.t('try_dropping_files')}
                                countLimit={1}
                                value={props.values.profilePicture}
                                setFieldValue={props.setFieldValue}
                                filesAreImages={true}

                                />
                          </FormRowLayout>
              </Panel>

              <Panel label={props.t("skills_and_interests")}>
                 {/*<FormRowLayout>
                                         <CheckboxGroupInput
                                           id="skillsAndInterests"
                                           label={props.t("Skills and interests")}
                                           disabled={!props.readOnly && selectOptions.skillsAndInterests ? false : true}
                                           error={props.touched.skillsAndInterests && props.t(props.errors.skillsAndInterests)}
                                           value={props.values.skillsAndInterests}
                                           setFieldValue={props.setFieldValue}
                                           options={selectOptions.skillsAndInterests ? selectOptions.skillsAndInterests:[]}
                                         />
                                  {selectOptions.skillsAndInterests ? null : <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                 
                  </FormRowLayout>*/}
                  <FormRowLayout>
                        <TextInput
                          id="skillsAndInterestsDetails"
                          type="text"
                          disabled={props.readOnly}
                          label={props.t("Skills and interests details")}
                          multiline
                          rows={6}
                          error={props.touched.skillsAndInterestsDetails && props.t(props.errors.skillsAndInterestsDetails)}
                          value={props.values.skillsAndInterestsDetails}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                        />
                  </FormRowLayout>
                  {/*<FormRowLayout>
                                          <TextInput
                                            id="expieriencesRelated"
                                            type="text"
                                            disabled={props.readOnly}
                                            label={props.t("Experiences related to these skills and interests")}
                                            multiline
                                            rows={6}
                                            error={props.touched.expieriencesRelated && props.t(props.errors.expieriencesRelated)}
                                            value={props.values.expieriencesRelated}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                          />
                                    </FormRowLayout>*/}
                  <FormRowLayout infoLabel={props.t("Link to example of own practice related to these skills and interests__description")} infoLabelFullHeight>
                                <TextInput
                                  id="linkToExample"
                                  disabled={props.readOnly}
                                  type="text"
                                  label={props.t("Link to example of own practice related to these skills and interests")}
                                  error={props.touched.linkToExample && props.t(props.errors.linkToExample)}
                                  value={props.values.linkToExample}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                />
                  </FormRowLayout> 
                  <FormRowLayout infoLabel={''}>
                
                        <LanguagesInput
                                id="languages"
                                multiSelect={true}
                                disabled={props.readOnly}
                                label={props.t("Language(s) spoken")}
                                value={props.values.languages}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                setFieldValue={props.setFieldValue}
                                error={props.touched.languages && props.t(props.errors.languages)}
                              />   
                        </FormRowLayout> 
              </Panel>

              <Panel label={props.t("requirements")}>
                <FormRowLayout infoLabel={props.t("I eat__description")} infoLabelFullHeight>
                    <SelectInput
                                id="iEat"
                                type='text'
                                disabled={!props.readOnly && selectOptions.foodOptions ? false : true}
                                label={props.t("I eat")}
                                error={props.touched.iEat && props.t(props.errors.iEat)}
                                value={props.values.iEat}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                options={selectOptions.foodOptions ? selectOptions.foodOptions : []}
                              />
                              {selectOptions.foodOptions ? null : <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}

                </FormRowLayout>
                <FormRowLayout infoLabel={props.t("Additional food requirements__description")} infoLabelFullHeight>
                        <TextInput
                          id="foodRequirements"
                          type="text"
                          disabled={props.readOnly}
                          label={props.t("Additional food requirements")}
                          multiline
                          rows={4}
                          error={props.touched.foodRequirements && props.t(props.errors.foodRequirements)}
                          value={props.values.foodRequirements}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                        />
                  </FormRowLayout>
                   <FormRowLayout>
                        <TextInput
                          id="medicalRequirements"
                          type="text"
                          disabled={props.readOnly}
                          label={props.t("Medical and other specific requirements")}
                          multiline
                          rows={4}
                          error={props.touched.medicalRequirements && props.t(props.errors.medicalRequirements)}
                          value={props.values.medicalRequirements}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                        />
                  </FormRowLayout>
              </Panel>

               <Panel label={props.t("privacy")}>

                  <FormRowLayout infoLabel={props.t("Don't show my profile on websites__description")} infoLabelFullHeight>
                          <CheckboxInput
                                id="showMyProfile"
                                disabled={props.readOnly}
                                label={props.t("Don't show my profile on websites")}
                                error={props.touched.showMyProfile && props.t(props.errors.showMyProfile)}
                                value={props.values.showMyProfile}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                          <CheckboxInput
                            id="showMyMail"
                            disabled={props.readOnly}
                            label={props.t("Don't show my e-mail address on websites")}
                            error={props.touched.showMyMail && props.t(props.errors.showMyMail)}
                            value={props.values.showMyMail}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                          <CheckboxInput
                                id="showMyName"
                                disabled={props.readOnly}
                                label={props.t("Don't show my real name and age on websites")}
                                error={props.touched.showMyName && props.t(props.errors.showMyName)}
                                value={props.values.showMyName}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                           <CheckboxInput
                                id="showMyPhone"
                                disabled={props.readOnly}
                                label={props.t("Don't show my phone number on websites")}
                                error={props.touched.showMyPhone && props.t(props.errors.showMyPhone)}
                                value={props.values.showMyPhone}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                           <CheckboxInput
                                id="showMyAddress"
                                disabled={props.readOnly}
                                label={props.t("Don't show my postal address on websites")}
                                error={props.touched.showMyAddress && props.t(props.errors.showMyAddress)}
                                value={props.values.showMyAddress}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                  </FormRowLayout>

                               
                </Panel>

                
               
              
                
            </div>
          );
        }} />
        );
    }
}
export const Basic = BasicForm;

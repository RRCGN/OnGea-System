import React, {Component} from 'react';
//import 'antd/dist/antd.css';
import {SubmitAndReset} from './SubmitAndReset';
import SignupForm_Fields from './SignupForm_Fields';
import {Disclaimer} from './Disclaimer';
import {config} from '../config/config';
import {countries as Countries, DialCodes} from '../config/constants';
import api from '../utils/api';
import { Form, Input, Select, DatePicker, Spin, Icon, Radio, Alert} from 'antd';
import moment from 'moment';
import { parsePhoneNumber } from 'libphonenumber-js';
import { getDateForObj } from '../utils/dateHelpers';




const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const Loader = <Icon type="loading" style={{ fontSize: 24, position: 'absolute', left:50+'%', top:50+'%', marginTop:-12+'px',marginLeft:-12+'px' }} spin />;
const RadioGroup = Radio.Group;


const formItemLayout = {
      labelCol: {
        xs: { span: 24},
        sm: { span: 8},  
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
 



var basicData = {
                      signupFirstName: {type: "string", label: "First name(s)", setting: "in-sign-up-required", order:"A_1", groupLabel:"basic_information"},
                      signupFamilyName: {type: "string", label: "Family name(s)", setting: "in-sign-up-required", order:"A_2", groupLabel:"basic_information"},
                      signupEmail: {type: "email", label: "E-mail address", setting: "in-sign-up-required", order:"A_3", groupLabel:"basic_information"}

                    };

const fieldNames = {
  signupFirstName: "field_ongea_first_name",
  signupFamilyName: "field_ongea_last_name",
  signupEmail: "field_ongea_mail_address",
  signupAboutme: "field_ongea_profile_about",
  signupBirthday: "field_ongea_profile_birthdate",
  signupCanShare: "field_ongea_profile_canshare",
  signupCountry: "field_ongea_profile_country",
  signupEmergencyContact: "field_ongea_profile_emergcon",
  signupEmergencyPhone: "field_ongea_profile_emphone",
  signupExampleOf: "field_ongea_profile_exampleof",
  signupExpiresOn: "field_ongea_profile_expireson",
  signupFoodOptions: "field_ongea_profile_foodoptions",
  signupFoodRequirements: "field_ongea_profile_foodreq",
  signupGender: "field_ongea_profile_gender",
  signupHearAbout: "field_ongea_profile_hearabout",
  signupIssuedOn: "field_ongea_profile_issuedon",
  signupMotiviation: "field_ongea_profile_motivation",
  signupNationality: "field_ongea_profile_nationality",
  signupNickname: "field_ongea_profile_nickname",
  signupPassId: "field_ongea_profile_passid",
  signupPhone: "field_ongea_profile_phone",
  signupPostcode: "field_ongea_profile_postcode",
  signupProfilePic: "field_ongea_profile_profilepic",
  signupRegion: "field_ongea_profile_region",
  signupSkills: "field_ongea_profile_skills",
  signupSkillsDetails: "field_ongea_profile_skillsdetail",
  signupSkillsRelated: "field_ongea_profile_skillsrelate",
  signupSpecialaccomodation: "field_ongea_profile_specacc",
  signupStreet: "field_ongea_profile_street",
  signupTown: "field_ongea_profile_town",
  signupWebsite: "field_ongea_profile_website"
};

class SignupForm extends Component {
  
constructor(props) {
    super(props)

    this.state = {
        confirmDirty: false,
        sortedData:[],
        selectOptions:{},
        isSubmitting:false,
        alert:{},
        lastStep:false,
        isCreateProfile:false,
        userIsLoggedIn:(props.user && Object.keys(props.user).length!==0),
        edit:false
    }
    
  }


  
componentDidMount() {
  var data = this.props.optionalFields;
  var lastStep = false;
  const {userIsLoggedIn} = this.state;
  var edit=false;
  var isCreateProfile = false;


    if((!config.sendingOrganisationId || config.sendingOrganisation==="") && config.edit!==true){
   
      basicData.sendingOrganisation = {type: "ongea_organisations", label: "Sending organisation", setting: "in-sign-up-required", order:"A_0", groupLabel:"basic_information"}
    }
    this.getLists(this.getRequiredListNames());
    
    if(!userIsLoggedIn){
      if(!Object.keys(data).find((key)=>(data[key].setting==='after-login'))){
        lastStep=true;
      }else{
          data = this.filterStep2Fields(data);
      }
      

    }else{
        lastStep=true;
    }

    if(config.edit === true){
      edit=true;
    }


    if(data.whoCanSee === 'sign-up form available for everyone, filling it creates user profile'){
      isCreateProfile = true;
    }


console.log('lastStep',lastStep);

    this.setState({sortedData:this.sortData(Object.assign({},data,basicData)), lastStep, edit, isCreateProfile}); 

   
  }

/*isStep2Empty=(data)=>{
  for(var field in data){
    if(field.type && field.type === 'after-login'){
      return false;
    }

  }
  return true;
}*/


sortData(object, key){
    var sortable = [];
    for (var item in object) {
      if(object[item] && object[item].order)
      sortable.push([item, object[item]]);

    }
    
    sortable.sort(function(a, b) {
     
      var x = a[1].order.toLowerCase();
      var y = b[1].order.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    });
    return(sortable);
}

  handleReset = () => {
    this.props.form.resetFields();
  }

  


  getRequiredListNames(){
    var lists = [];
    const {optionalFields} = this.props; 
    const data = Object.assign({},optionalFields,basicData);

    for (var key in data) {
      if (data.hasOwnProperty(key) && data[key]) {
          const field = data[key];
          
          if (field.type === 'ongea_gender'){
            lists.push('gender');
          }
          if (field.type === 'ongea_ieat'){
            lists.push('foodoptions');
          }
          if (field.type === 'ongea_room'){
            lists.push('roomrequirement');
          }
          if (field.type === 'ongea_skills'){
            lists.push('skillsandinterests');
          }
          if (field.type === 'ongea_country'){
            lists.push('country');
          }
          if (field.type === 'ongea_organisations'){
            lists.push('organisations');
          }
      }
    }
    return(lists);

  }


  getLists(lists){
   var selectOptions = {};


   for (var i = 0; i < lists.length; i++) {
      const list = lists[i];
      
      if(list==='organisations'){
       
        api.getOrganisations({id:config.activityId})
          .then((result) => {
            var organisations = [];
            for(var i=0; i<result.body.length;i++){
              organisations.push({label:result.body[i].title,value:result.body[i].id});
            }
            selectOptions.organisations = organisations;
            this.setState({selectOptions});
          })
          .catch((error) => {
            console.error(error);
            this.setState({error:"Could not get organisations."});
            
          });
        
      }else if(list==='country'){
        
        selectOptions.country = this.getCountryOptions(Countries);
        this.setState({selectOptions});
      }else{
      api.getList({id:list})
          .then((result) => {
            console.log(list,result.body);
            selectOptions[list] = result.body.map((it)=>({label:this.props.t(it.label), value:it.key}));
            this.setState({selectOptions});
          })
          .catch((error) => {
            
            this.setState({error:"Could not get select field data"});
          });
      }

    }

  }


getCountryOptions = (countries)=>{
        var options = [];
        
        Object.keys(countries).map((key)=>{
          options.push({value:countries[key].code,label:countries[key].name+' - '+countries[key].code});
          return true;
        });

        return (options);
     };


mapValues = (values) =>{
  var payload = {};

  //delete values.prefix;
  //delete values.protocoll;

  for(var key in values){
    if(values[key]){
      const field = values[key];
      if(field._isAMomentObject === true){
        payload[key] = getDateForObj(field.toDate());
      }
      else if(key.split('_')[0] === 'prefix'){
        
      }
      else if(key.split('_')[0] === 'protocoll'){
        
      }
      else if(key === 'signupPhone'){
        payload[key] = values['prefix_signupPhone'] ? (values['prefix_signupPhone'].split('_')[1]+field) : field;
      }
      else if(key === 'signupEmergencyPhone'){
        payload[key] = values['prefix_signupEmergencyPhone'] ? (values['prefix_signupEmergencyPhone'].split('_')[1]+field) : field;
      }
      else if(key === 'signupWebsite'){
        payload[key] = values['protocoll_signupWebsite']+field;
      }
      else if(key === 'signupExampleOf'){
        payload[key] = values['protocoll_signupExampleOf']+field;
      }
      else{
        payload[key] = field;
      }
    }
  }
  return payload;
}


getSubmitMsg=(success)=>{

  const {userIsLoggedIn, isCreateProfile} = this.state;

  if(success && userIsLoggedIn){
    return 'signup_submission_reaction_registered_user';
  }
  else if(success && !userIsLoggedIn && isCreateProfile){
    return 'signup_submission_reaction_account_created';
  }
  else if(success && !userIsLoggedIn && !isCreateProfile){
    return 'signup_submission_reaction_external_user';
  }


}


  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({isSubmitting:true});
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        var payload = this.mapValues(values);
        console.log('sent payload of form: ',payload);
        
        if(this.state.edit === true){
           payload.edit = true;
        }
        if(this.state.lastStep){
          payload.complete = true;
        }
        

        console.log('payload',payload);

        api.submitForm({id:config.activityId},payload)
          .then((result) => {
            /*var description = '';
            if(!this.props.user || Object.keys(this.props.user).length ===0){
              description = 'An email has been sent to you with further instructions to complete your registration.'
            }*/
            const alert = {message:'Success', description:this.getSubmitMsg(true)};
            this.handleReset();
            this.setState({isSubmitting:false, alert});

            //console.log('ggg',result.body);
          })
          .catch((error) => {
            const alert = {message:'snackbar_form_submit_error',type:'error'};
            this.setState({isSubmitting:false, alert});
          });


      }else{
        console.log(err);
          const alert = {message:'snackbar_form_error_marked_fields',type:'error'};
          this.setState({isSubmitting:false, alert});
      }
    });
  }

writeFormItem = (key, field, fieldType ,validation, listType) => {
    
     const { getFieldDecorator } = this.props.form;
     const {selectOptions} = this.state;

    return(
            <FormItem 
                {...formItemLayout}
                    colon={false}
                    label={<div style={{display: 'inline-block',whiteSpace:'normal', lineHeight:'1.4em', textAlign:'right',paddingRight:'10px'}}>{field.label && (this.props.t(field.label)+':')}</div>}
                  >
         
                  {getFieldDecorator(key, validation)(
                    fieldType
                  )}
                {listType && !selectOptions[listType] && Loader}
            </FormItem>
      );

  }

  writeInputField = (field,key, i) => {
      const {selectOptions, organisations} = this.state;
      const { getFieldDecorator } = this.props.form;
      const {t} = this.props;

      var initialValue = undefined;
      var urlPrefix = null;
      var readOnly = false;
      var urlSelector = null;
      var prefixSelector = null;
      const prefixOptions = DialCodes.map((it, i)=>({value:it.code+'_'+it.dial_code,label:it.code+ ' ('+it.dial_code+')'}));

      if(this.props.user && this.props.user[fieldNames[key]] && this.props.user[fieldNames[key]].length >0 && (this.props.user[fieldNames[key]][0].value || this.props.user[fieldNames[key]][0].target_id)){

        if(this.props.user[fieldNames[key]][0].value){
          initialValue = this.props.user[fieldNames[key]][0].value;
        }
        if((field.type === 'ongea_gender'  || field.type === 'ongea_ieat')&& this.props.user[fieldNames[key]][0].target_id){
          initialValue = parseInt(this.props.user[fieldNames[key]][0].target_id,10);
        }
        
        
        


        

        if(field.type === 'url'){
          
          if(initialValue.substring(0,8) === 'https://'){
            urlPrefix = 'https://';
            initialValue = initialValue.replace('https://','');
          }else{
            urlPrefix = 'http://'
             initialValue = initialValue.replace('http://','');
          }

        }


        if(field.type === 'phone'){
          
          var telPrefix = undefined;
          try{
            const phoneNumber = parsePhoneNumber(initialValue);
                
                    if(phoneNumber.isValid()){
                      const countryCode = phoneNumber.country;
          
                      initialValue = phoneNumber.nationalNumber;
                      telPrefix = prefixOptions.find((it)=>(it.value.includes(countryCode)));
                      if(telPrefix){
                        telPrefix = telPrefix.value;
                      }
                    }else{
                      console.error('Could not get prefix from phonenumber');
                    }
          } catch (error){
              console.error(error);
          }

        }

        
      }


      if(field.type === 'ongea_room' && this.props.mobility && this.props.mobility.roomRequirements){
          initialValue = this.props.mobility.roomRequirements;
        }


      //console.log(this.props.user);
      if(this.props.user && Object.keys(this.props.user).length > 0 && field.setting !== 'after-login' && initialValue){
        readOnly=true;
      }


      const radioStyle = {
      top:'5px',
      left:'10px',
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    if(field.type === 'phone'){
         prefixSelector = getFieldDecorator('prefix_'+key, {
          initialValue: telPrefix,
        })(
          <Select 
            disabled={readOnly} 
            showSearch 
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} 
            style={{ width: 130 }}
            >
          {prefixOptions.map((it, i)=>{
            return <Option key={'dial_code_'+i} value={it.value}>{it.label}</Option>;
            })}
          </Select>
        );
    }

    if(field.type === 'url'){
       urlSelector = getFieldDecorator('protocoll_'+key, {
        initialValue: urlPrefix || 'http://',
      })(
        <Select disabled={readOnly} style={{ width: 90 }}>
          <Option value="http://">http://</Option>
          <Option value="https://">https://</Option>
        </Select>
      );
    } 
      return(
        <div key={'formItem_'+i}>
          
                {(field.type === "string" &&
                                    this.writeFormItem(key, field, <Input disabled={readOnly}/> , {initialValue: initialValue, rules: [{ required: (field.setting === 'in-sign-up-required' ? true : false), message: t('signup_form_validation_required')}, { whitespace: true, message:t('signup_form_validation_required') }]})
                                  )}

                {(field.type === "text" &&
                                    this.writeFormItem(key, field, <TextArea disabled={readOnly} rows={4} /> , {initialValue: initialValue, rules: [{ required: (field.setting === 'in-sign-up-required' ? true : false), message: t('signup_form_validation_required')}, { whitespace: true, message:t('signup_form_validation_required') }]})
                                  )}
            


                   {(field.type === "date" &&
                                    this.writeFormItem(key, field, <DatePicker disabled={readOnly} format="DD.MM.YYYY"/> , {initialValue: initialValue ? moment(initialValue) : undefined, rules: [{ type: 'object', message:t('signup_form_validation_date')},{ required: true, message: t('signup_form_validation_required') }]})
                                  )}

           
                   {(field.type === "ongea_organisations" && 
                                    this.writeFormItem(key, field,  

                                      <Select 
                                        showSearch 
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        disabled={selectOptions.organisations && !readOnly ? false : true}
                                        >

                                          {selectOptions.organisations && selectOptions.organisations.map((option, i)=>{
                                            return(
                                                <Option key={'organisations'+i} value={option.value}>{option.label}</Option>

                                              );
                                          })}
                                         </Select>,
                                          {initialValue: initialValue,
                                            rules: [{ required: (field.setting === 'in-sign-up-required' ? true : false), message: t('signup_form_validation_required')} ]}, "organisations")
                                    )}

                   {(field.type === "ongea_country" && 
                                    this.writeFormItem(key, field,  

                                      <Select 
                                          showSearch  
                                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} 
                                          disabled={selectOptions.country && !readOnly ? false : true}
                                          >

                                          {selectOptions.country && selectOptions.country.map((option, i)=>{
                                            return(
                                                <Option key={'countryOption'+i} value={option.value}>{option.label}</Option>

                                              );
                                          })}
                                         </Select>,
                                          {initialValue: initialValue,
                                            rules: [{ required: (field.setting === 'in-sign-up-required' ? true : false), message: t('signup_form_validation_required')} ]}, "country")
                                    )}


                   {(field.type === "ongea_gender" && 
                                    this.writeFormItem(key, field,  

                                        
                                      <RadioGroup disabled={selectOptions.gender && !readOnly ? false : true}>
                                          {selectOptions.gender && selectOptions.gender.map((option, i)=>{
                                            return(
                                                <Radio key={'genderOption'+i} style={radioStyle} value={option.value}>{option.label}</Radio>

                                              );
                                          })}
                                      </RadioGroup>
                                         ,
                                          {initialValue: initialValue,
                                            rules: [{ required: (field.setting === 'in-sign-up-required' ? true : false), message: t('signup_form_validation_required')} ]},
                                           "gender"
                                           )
                                    )}

                   {(field.type === "ongea_ieat" && 
                                    this.writeFormItem(key, field,  

                                      <Select disabled={selectOptions.foodoptions && !readOnly ? false : true}>

                                          {selectOptions.foodoptions && selectOptions.foodoptions.map((option, i)=>{
                                            return(
                                                <Option key={'ieatOption'+i} value={option.value}>{option.label}</Option>

                                              );
                                          })}
                                         </Select>,
                                          {initialValue: initialValue,
                                            rules: [{ required: (field.setting === 'in-sign-up-required' ? true : false), message: t('signup_form_validation_required')} ]}, "foodoptions")
                                    )}


                   {(field.type === "ongea_room" && 
                                    this.writeFormItem(key, field,  

                                      <Select disabled={selectOptions.roomrequirement  && !readOnly ? false : true}>

                                          {selectOptions.roomrequirement && selectOptions.roomrequirement.map((option, i)=>{
                                            return(
                                                <Option key={'roomOption'+i} value={option.value}>{option.label}</Option>

                                              );
                                          })}
                                         </Select>,
                                          {initialValue: initialValue,
                                            rules: [{ required: (field.setting === 'in-sign-up-required' ? true : false), message: t('signup_form_validation_required')}]}, "roomrequirement")
                                    )}

                   {(field.type === "ongea_skills" && 
                                    this.writeFormItem(key, field,  

                                      <Select mode="multiple" disabled={selectOptions.skillsandinterests && !readOnly ? false : true}>

                                          {selectOptions.skillsandinterests && selectOptions.skillsandinterests.map((option, i)=>{
                                            return(
                                                <Option key={'roomOption'+i} value={option.value}>{option.label}</Option>

                                              );
                                          })}
                                         </Select>,
                                          {initialValue: initialValue,
                                            rules: [{ required: (field.setting === 'in-sign-up-required' ? true : false), message: t('signup_form_validation_required')} ]}, "skillsandinterests")
                                    )}
                       
                    {(field.type === "phone" &&
                                    this.writeFormItem(key, field, <Input disabled={readOnly} addonBefore={prefixSelector} style={{ width: '100%' }} /> , {initialValue: initialValue,
                                      rules: [{ required: (field.setting === 'in-sign-up-required' ? true : false), message: t('signup_form_validation_required')}, { whitespace: true, message:t('signup_form_validation_required') } ]})
                                  )} 

                    {(field.type === "url" &&
                                    this.writeFormItem(key, field, <Input disabled={readOnly} addonBefore={urlSelector} style={{ width: '100%' }} /> , {initialValue: initialValue,
                                      rules: [{transform(value){
                                        if(value){
                                            return(((urlPrefix && urlPrefix==='https://')?'https://':'http://')+value);
                                        }else{
                                            return value;
                                        }
                                        
                                        }},{ type:"url", message:t('url_valid')},{ required: (field.setting === 'in-sign-up-required' ? true : false), message: t('signup_form_validation_required')}, { whitespace: true, message:t('signup_form_validation_required')  }]})
                                  )} 

                     {(field.type === "email" &&
                                    this.writeFormItem(key, field, <Input disabled={readOnly}/> , {validateTrigger:'onBlur',validateFirst:true,initialValue: initialValue,
                                      rules: [{ type:"email", message:t('email_valid')},{required: (field.setting === 'in-sign-up-required' ? true : false), message: t('signup_form_validation_required')},
                                      {validator(rule, value, callback){
                                        
                                        if(!readOnly){

                                          fetch(config.basePath+'/check-email/'+value)
                                                .then((response) => {
                                                  return response.json();
                                                })
                                                .then((result)=>{
                                                  //console.log('ggg',result);
                                                    if(result.user === true){
                                                      
                                                      //errors.push('You already have an account, please login first.');
                                                      if(config.appLoginUrl && config.appLoginUrl !== ''){
                                                        callback(new Error(this.props.t("signup_form_email_validation_with_url",{loginUrl: config.appLoginUrl})));
                                                      }else{
                                                        callback(new Error(this.props.t('signup_form_email_validation')));
                                                      }
                                                      //console.log('true');
                                                    }else{
                                                      //console.log('false1');
                                                      callback();
                                                    }
                                                })
                                                .catch((error) => {
                                                  callback(new Error(error));
                                                  console.error(error);
                                                });
                                          }else{
                                            callback();
                                          }
                                        
                                    }},{ whitespace: true, message:t('signup_form_validation_required') }]})
                                  )}                  

                                     
            </div>

        );

  }

filterStep2Fields = (fields) => {

  for(var key in fields){
    if(fields[key].setting && fields[key].setting === 'after-login'){
      
      delete fields[key];
    }
  }
  return fields;
}


  render() {
   
    const { getFieldDecorator } = this.props.form;
    const {sortedData, selectOptions, isSubmitting, alert} = this.state;
    const {t} = this.props;
    var sortedDataBasic = [];
    var sortedDataOptional = [];

   


  

    if(sortedData.length >0){
      sortedDataBasic = sortedData.filter((item)=>{return(item[1].order.split('_')[0].toLowerCase() === 'a')});
      sortedDataOptional = sortedData.filter((item)=>{return(item[1].order.split('_')[0].toLowerCase() !== 'a')});
    }

    return (
        <div>
          { (sortedData.length > 0 && selectOptions) &&
            <Form onSubmit={this.handleSubmit}>

              <SignupForm_Fields t={t} sortedData={sortedDataBasic} writeInputField={this.writeInputField} />

              {sortedData.length > 0 &&
                <SignupForm_Fields t={t} sortedData={sortedDataOptional} writeInputField={this.writeInputField} />
              }

              <Disclaimer 
              t={t}
              writeFormItem={this.writeFormItem}
              />
              <br />
              


              {alert && alert.message && <Alert
                    message={t(alert.message)}
                    description={t(alert.description) || ''}
                    type={alert.type || 'success'}
                    showIcon
                  />}
              <br/>

                <FormItem
                {...tailFormItemLayout}>
                  <SubmitAndReset  t={t} handleReset={this.handleReset} isSubmitting={isSubmitting} userIsLoggedIn={this.state.userIsLoggedIn}/>
                </FormItem>
              
              
            </Form>
          }
        </div>
          );
  }
}

export default Form.create()(SignupForm);

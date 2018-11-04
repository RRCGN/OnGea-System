import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {SubmitAndReset} from './SubmitAndReset';
import SignupForm_Fields from './SignupForm_Fields';
import {config} from '../config/config';
import {countries as Countries} from '../config/constants';
import api from '../utils/api';
import { Form, Input, Select, DatePicker, Spin, Icon, Radio} from 'antd';


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
 

/*const tempData = {
    signupAboutMe: {type: "text", label: "about_me", setting: "in-sign-up-optional", order:"F_1", groupLabel: "about_me"},
    signupBirthday: {type: "date", label: "Birth date", setting: "in-sign-up-required", order:"A_5", groupLabel: "basic_information"},
    signupCanShare: {type: "string", label: "Can share with", setting: "in-sign-up-optional", order:"H_6", groupLabel:"requirements"},
    signupCountry: {type: "ongea_country", label: "Country", setting: "in-sign-up-required", order:"B_5", groupLabel:"address"},
    signupEmergencyContact: {type: "string", label: "Emergency contact name", setting: "in-sign-up-optional", order:"D_1", groupLabel:"emergency_contact"},
    signupEmergencyPhone: {type: "phone", label: "Emergency contact phone number (mobile)", setting: "in-sign-up-optional", order:"D_2", groupLabel:"emergency_contact"},
    signupExampleOf: {type: "url", label: "Link to example of own practice related to these skills and interests", setting: "in-sign-up-optional", order:"G_4", groupLabel:"skills_and_interests"},
    signupExpiresOn: {type: "date-m", label: "Expires on", setting: "in-sign-up-optional", order:"E_4", groupLabel:"passport_data"},
    signupFoodOptions: {type: "ongea_ieat", label: "I eat", setting: "in-sign-up-optional", order:"H_1", groupLabel:"requirements"},
    signupFoodRequirements: {type: "text", label: "Additional food requirements", setting: "in-sign-up-optional", order:"H_2", groupLabel:"requirements"},
    signupGender: {type: "ongea_gender", label: "Gender", setting: "in-sign-up-required", order:"A_4", groupLabel:"basic_information"},
    signupHearAbout: {type: "text", label: "How did you hear about this activity?", setting: "in-sign-up-optional", order:"L_1", groupLabel:"motivation"},
    signupIssuedOn: {type: "date-m", label: "Issued on", setting: "in-sign-up-optional", order:"E_3", groupLabel:"passport_data"},
    signupMedicalRequirements: {type: "text", label: "Medical and other specific requirements", setting: "in-sign-up-optional", order:"H_3", groupLabel:"requirements"},
    signupMotiviation: {type: "text", label: "What is your motivation to participate in this activity?", setting: "in-sign-up-optional", order:"L_2", groupLabel:"motivation"},
    signupNationality: {type: "string", label: "Nationality", setting: "in-sign-up-optional", order:"E_5", groupLabel:"passport_data"},
    signupNickname: {type: "string", label: "Artist name / nick name", setting: "in-sign-up-optional", order:"A_3", groupLabel:"basic_information"},
    signupPassId: {type: "string", label: "ID document number", setting: "in-sign-up-optional", order:"E_1", groupLabel:"passport_data"},
    signupPhone: {type: "phone", label: "Phone", setting: "in-sign-up-required", order:"C_1", groupLabel:"contact_data"},
    signupPostcode: {type: "string", label: "Postal code", setting: "in-sign-up-required", order:"B_2", groupLabel:"address"},
    signupProfilePic: {type: "file-p", label: "Profile picture", setting: "in-sign-up-optional", order:"F_2", groupLabel:"about_me"},
    signupRegion: {type: "string", label: "Region", setting: "in-sign-up-required", order:"B_4", groupLabel:"address"},
    signupRoomRequirements: {type: "ongea_room", label: "Room requirements", setting: "in-sign-up-optional", order:"H_4", groupLabel:"requirements"},
    signupSkillsDetails: {type: "text", label: "Skills and interests details", setting: "in-sign-up-optional", order:"G_2", groupLabel:"skills_and_interests"},
    signupSkillsRelated: {type: "text", label: "Skills and interests for this activity", setting: "in-sign-up-optional", order:"G_3", groupLabel:"skills_and_interests"},
    signupSpecialAccomodation: {type: "text", label: "Special accommodation requirements", setting: "in-sign-up-optional", order:"H_5", groupLabel:"requirements"},
    signupStreet: {type: "string", label: "Street address", setting: "in-sign-up-required", order:"B_1", groupLabel:"address"},
    signupTown: {type: "string", label: "City", setting: "in-sign-up-required", order:"B_3", groupLabel:"address"},
    signupWebsite: {type: "url", label: "Website", setting: "in-sign-up-optional", order:"C_3", groupLabel:"contact_data"},
    signupSkills: {type: "ongea_skills", label: "Skills and interests", order:"G_1", groupLabel:"skills_and_interests"}
};*/

var basicData = {
                      signupFirstName: {type: "string", label: "First name(s)", setting: "in-sign-up-required", order:"A_1", groupLabel:"basic_information"},
                      signupFamilyName: {type: "string", label: "Family name(s)", setting: "in-sign-up-required", order:"A_2", groupLabel:"basic_information"},
                      signupEmail: {type: "email", label: "E-mail address", setting: "in-sign-up-required", order:"A_3", groupLabel:"basic_information"}

                    };

class SignupForm extends Component {
  
constructor(props) {
    super(props)

    this.state = {
        confirmDirty: false,
        sortedData:[],
        selectOptions:{},
    }
    
  }


  
componentDidMount() {
  var data = this.props.optionalFields;
  
    if(!config.sendingOrganisationId || config.sendingOrganisation===""){
   
      basicData.sendingOrganisation = {type: "ongea_organisations", label: "Sending organisation", setting: "in-sign-up-required", order:"A_0", groupLabel:"basic_information"}
    }
    this.getLists(this.getRequiredListNames());
    
    this.setState({sortedData:this.sortData(Object.assign({},data,basicData))}); 

   
  }


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
            
            selectOptions[list] = result.body;
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
        payload[key] = field._d.getDate();
      }
      else if(key === 'prefix'){
        
      }
      else if(key === 'protocoll'){
        
      }
      else if(key === 'signupPhone'){
        payload[key] = values['prefix']+field[key];
      }
      else if(key === 'signupWebsite'){
        payload[key] = values['protocoll']+field[key];
      }
      else{
        payload[key] = field;
      }
    }
  }
  return payload;
}



  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        var payload = this.mapValues(values);

        

      console.log('payload',payload);

        api.submitForm({id:config.activityId},payload)
          .then((result) => {
            
            //console.log('ggg',result.body);
          })
          .catch((error) => {
            
            this.setState({error:"Could not get form data",isLoading:false});
          });


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
                    label={<div style={{display: 'inline-block',whiteSpace:'normal', lineHeight:'1.4em', textAlign:'left',paddingRight:'10px'}}>{field.label+':'}</div>}
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
      
      const radioStyle = {
      top:'5px',
      left:'10px',
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '+86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="+86">+86</Option>
        <Option value="+87">+87</Option>
      </Select>
    );
    const urlSelector = getFieldDecorator('protocoll', {
      initialValue: 'http://',
    })(
      <Select style={{ width: 90 }}>
        <Option value="http://">http://</Option>
        <Option value="https://">https://</Option>
      </Select>
    );
      return(
        <div key={'formItem_'+i}>
          
                {(field.type === "string" &&
                                    this.writeFormItem(key, field, <Input /> , {rules: [{ required: (field.setting === 'in-sign-up-required' ? true : false), message: 'This field is required.'}, { whitespace: true, message:'This field is required.' }]})
                                  )}

                {(field.type === "text" &&
                                    this.writeFormItem(key, field, <TextArea rows={4} /> , {rules: [{ required: (field.setting === 'in-sign-up-required' ? true : false), message: 'This field is required.'}, { whitespace: true, message:'This field is required.' }]})
                                  )}
            


                   {(field.type === "date" &&
                                    this.writeFormItem(key, field, <DatePicker format="YYYY-MM-DD"/> , {rules: [{ type: 'object', message:'This is not a valid date.'},{ required: true, message: 'This field is required.' }]})
                                  )}

           
                   {(field.type === "ongea_organisations" && 
                                    this.writeFormItem(key, field,  

                                      <Select disabled={selectOptions.organisations ? false : true}>

                                          {selectOptions.organisations && selectOptions.organisations.map((option, i)=>{
                                            return(
                                                <Option key={'organisations'+i} value={option.value}>{option.label}</Option>

                                              );
                                          })}
                                         </Select>,
                                          {rules: [{ required: (field.setting === 'in-sign-up-required' ? true : false), message: 'This field is required.'} ]}, "organisations")
                                    )}

                   {(field.type === "ongea_country" && 
                                    this.writeFormItem(key, field,  

                                      <Select disabled={selectOptions.country ? false : true}>

                                          {selectOptions.country && selectOptions.country.map((option, i)=>{
                                            return(
                                                <Option key={'countryOption'+i} value={option.value}>{option.label}</Option>

                                              );
                                          })}
                                         </Select>,
                                          {rules: [{ required: (field.setting === 'in-sign-up-required' ? true : false), message: 'This field is required.'} ]}, "country")
                                    )}


                   {(field.type === "ongea_gender" && 
                                    this.writeFormItem(key, field,  

                                        
                                      <RadioGroup disabled={selectOptions.gender ? false : true}>
                                          {selectOptions.gender && selectOptions.gender.map((option, i)=>{
                                            return(
                                                <Radio key={'genderOption'+i} style={radioStyle} value={option.value}>{option.label}</Radio>

                                              );
                                          })}
                                      </RadioGroup>
                                         ,
                                          {rules: [{ type:'string', message:'This is not a valid input.'},{ required: (field.setting === 'in-sign-up-required' ? true : false), message: 'This field is required.'}, { whitespace: true, message:'This field is required.' } ]}, "gender")
                                    )}

                   {(field.type === "ongea_ieat" && 
                                    this.writeFormItem(key, field,  

                                      <Select disabled={selectOptions.foodoptions ? false : true}>

                                          {selectOptions.foodoptions && selectOptions.foodoptions.map((option, i)=>{
                                            return(
                                                <Option key={'ieatOption'+i} value={option.value}>{option.label}</Option>

                                              );
                                          })}
                                         </Select>,
                                          {rules: [{ type:'string', message:'This is not a valid input.'},{ required: (field.setting === 'in-sign-up-required' ? true : false), message: 'This field is required.'}, { whitespace: true, message:'This field is required.' } ]}, "foodoptions")
                                    )}


                   {(field.type === "ongea_room" && 
                                    this.writeFormItem(key, field,  

                                      <Select disabled={selectOptions.roomrequirement ? false : true}>

                                          {selectOptions.roomrequirement && selectOptions.roomrequirement.map((option, i)=>{
                                            return(
                                                <Option key={'roomOption'+i} value={option.value}>{option.label}</Option>

                                              );
                                          })}
                                         </Select>,
                                          {rules: [{ type:'string', message:'This is not a valid input.'},{ required: (field.setting === 'in-sign-up-required' ? true : false), message: 'This field is required.'}, { whitespace: true, message:'This field is required.' } ]}, "roomrequirement")
                                    )}

                   {(field.type === "ongea_skills" && 
                                    this.writeFormItem(key, field,  

                                      <Select mode="multiple" disabled={selectOptions.skillsandinterests ? false : true}>

                                          {selectOptions.skillsandinterests && selectOptions.skillsandinterests.map((option, i)=>{
                                            return(
                                                <Option key={'roomOption'+i} value={option.value}>{option.label}</Option>

                                              );
                                          })}
                                         </Select>,
                                          {rules: [{ type:'array', message:'This is not a date.'},{ required: (field.setting === 'in-sign-up-required' ? true : false), message: 'This field is required.'} ]}, "skillsandinterests")
                                    )}
                       
                    {(field.type === "phone" &&
                                    this.writeFormItem(key, field, <Input addonBefore={prefixSelector} style={{ width: '100%' }} /> , {rules: [{ required: (field.setting === 'in-sign-up-required' ? true : false), message: 'This field is required.'}, { whitespace: true, message:'This field is required.' } ]})
                                  )} 

                    {(field.type === "url" &&
                                    this.writeFormItem(key, field, <Input addonBefore={urlSelector} style={{ width: '100%' }} /> , {rules: [{ type:"url", message:'This is not a valid url.'},{ required: (field.setting === 'in-sign-up-required' ? true : false), message: 'This field is required.'}, { whitespace: true, message:'This field is required.'  }]})
                                  )} 

                     {(field.type === "email" &&
                                    this.writeFormItem(key, field, <Input /> , {validateTrigger:'onBlur',validateFirst:true,rules: [{ type:"email", message:'This is not a valid e-mail address.'},{required: (field.setting === 'in-sign-up-required' ? true : false), message: 'This field is required.'},
                                      {validator(rule, value, callback){
                                        

                                          //console.log(config.basePath);
                                          fetch(config.basePath+'/check-email/'+value)
                                            .then((response) => {
                                              return response.json();
                                            })
                                            .then((result)=>{
                                              //console.log('ggg',result);
                                                if(result.user === true){
                                                  
                                                  //errors.push('You already have an account, please login first.');
                                                  if(config.appLoginUrl && config.appLoginUrl !== ''){
                                                    callback(new Error("You are already registered, please login at "+config.appLoginUrl));
                                                  }else{
                                                    callback(new Error('You are already registered, please login first.'));
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

                                        
                                    }},{ whitespace: true, message:'This field is required.' }]})
                                  )}                  

                                     
            </div>

        );

  }



  render() {
   
    const { getFieldDecorator } = this.props.form;
    const {sortedData, selectOptions} = this.state;
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

              <SignupForm_Fields sortedData={sortedDataBasic} writeInputField={this.writeInputField} />

              {sortedData.length > 0 &&
                <SignupForm_Fields sortedData={sortedDataOptional} writeInputField={this.writeInputField} />
              }

              
                <FormItem
                {...tailFormItemLayout}>
                  <SubmitAndReset handleReset={this.handleReset} />
                </FormItem>
              
              
            </Form>
          }
        </div>
          );
  }
}

export default Form.create()(SignupForm);

import React from 'react';
import Panel from '../elements/Panel';
import EditView from '../_Views/EditView';
import { ContentTypes } from '../../config/content_types';
import {TextInput, SelectInput, CheckboxInput} from '../elements/FormElements/FormElements';
import FormRowLayout from '../elements/FormElements/FormRowLayout';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';



 



export class NewAnnouncementForm extends React.Component {
   
  constructor(props) {
    super(props);

    this.state = {
          data:this.props.data,
          selectOptions: {},
          activities:[],
          isDisabled:true
        }; 


  }


  static defaultProps = {
    contentType: ContentTypes.Announcements
  }
  

  componentDidMount(){
    this.getData(ContentTypes.Activities);
    
    if(this.props.match.params.id === "new"){

      this.setInitialValues();

    }

  }

  setInitialValues = () => {

        
              var data = {
                  sendInActivity:null,
                  fromOrganisation:null,
                  toParts:false,
                  toGrouplead:false,
                  toStaff:false,
                  Applicants:false,
                  message:null

              };
              
              this.setState({data});
      }


  customOnChange(event,formikHandleChange){
    
    formikHandleChange(event);
    if(event.target.name === "sendInActivity"){
      this.filterOrganisations(event.target.value);
      if(!this.setState.isDisabled){
        this.setState({isDisabled:true});
      }
    }
    if(event.target.name === "fromOrganisation" && event.target.value){

      this.setState({isDisabled:false});
    }

  }

filterOrganisations = (activityID) => {
 // console.log(activityID);
  const activities = this.state.activities;
  const activity = activities.filter((activity)=>{return activity.id === activityID});
 
  const organisations = activity[0].organisations;
  var selectOptions = Object.assign(this.state.selectOptions);
  selectOptions.organisations = [];

  if(organisations && organisations.length){
    
    organisations.map((organisation)=>{
      selectOptions.organisations.push({value:organisation.id, label:organisation.title});
      return true;
    });
  }else{
    selectOptions.organisations = [{value:null, label:'no organisations in this activity'}];
  }
  this.setState({selectOptions});
}


getData = (contentType) => {
    
    const api = contentType.api;
    var data = [];
    let selectOptions = Object.assign(this.state.selectOptions);
    

    
    api
          .getEntire({_format:'json'})
          .then((result) => {
            
            
            //this.props.updateTitle(result.body.title);
            result.body.map((set) => {
                data.push({value:set.id,label:set.title});
                return true;
            });
            selectOptions[contentType.id] = data;
            
            this.setState({selectOptions});
            if(contentType.id === "activities"){
                this.setState({activities:result.body});
            }
           
          })
          .catch((error) => {
            console.error(error);
            
          });
          
        
  }


    render() {

      const {data, ...props} = this.props;
      const {selectOptions, isDisabled} = this.state;
      //console.log('asdads',selectOptions);

       return (
           <EditView data={this.state.data} {...props} saveLabel="Send" render={(props) => (
            
            <Panel label={this.props.t('new_ announcement_to_participants')}>

             
                      <FormRowLayout infoLabel=''>
                          <SelectInput
                                id="sendInActivity"
                                type='text'
                                label={props.t("Activity")}
                                disabled={selectOptions.activities ? false : true}
                                error={props.touched.sendInActivity && props.errors.sendInActivity}
                                value={props.values.sendInActivity}
                                onChange={(event)=>this.customOnChange(event,props.handleChange)}
                                onBlur={props.handleBlur}
                                options={selectOptions.activities || []}
                              />
                              {!selectOptions.activities && <CircularProgress size={24} className='ongeaAct__activity__all_forms__selectLoading'/>}
                      </FormRowLayout>
                      <FormRowLayout infoLabel=''>
                        
                          <SelectInput
                                id="fromOrganisation"
                                type='text'
                                label={props.t("Organisation")}
                                disabled={selectOptions.organisations ? false : true}
                                error={props.touched.fromOrganisation && props.errors.fromOrganisation}
                                value={props.values.fromOrganisation}
                                onChange={(event)=>this.customOnChange(event,props.handleChange)}
                                onBlur={props.handleBlur}
                                options={selectOptions.organisations || []}
                              />
                      </FormRowLayout>
                      <FormRowLayout infoLabel=''>  
                      <FormControl>      
                        <FormLabel>{props.t('send_to')}</FormLabel>
                        <br/>
                        <FormGroup className="ongeaAct__formGroup--inline">
                          <CheckboxInput
                                id="toParts"
                                disabled = {isDisabled}
                                label={props.t("Participants")}
                                error={props.touched.sendTo && props.errors.sendTo}
                                value={props.values.sendTo}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                      
                          <CheckboxInput
                                id="toGrouplead"
                                label={props.t("Group leaders")}
                                disabled = {isDisabled}
                                error={props.touched.sendTo && props.errors.sendTo}
                                value={props.values.sendTo}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                      
                          <CheckboxInput
                                id="toStaff"
                                label={props.t("Additional staff")}
                                disabled = {isDisabled}
                                error={props.touched.sendTo && props.errors.sendTo}
                                value={props.values.sendTo}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                      
                          <CheckboxInput
                                id="Applicants"
                                label={props.t("Applicants")}
                                disabled = {isDisabled}
                                error={props.touched.sendTo && props.errors.sendTo}
                                value={props.values.sendTo}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                     
                      </FormGroup>
                     </FormControl>
                    </FormRowLayout>
                     <FormRowLayout>
                              <TextInput
                                id="message"
                                type="text"
                                disabled = {isDisabled}
                                label={props.t("announcement")}
                                multiline
                                rows="7"
                                error={props.touched.message && props.errors.message}
                                value={props.values.message}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                     </FormRowLayout>
               
              
                
            </Panel>
          )} />
        );
    }
}
export const NewAnnouncement = NewAnnouncementForm;

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
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {getParams} from '../../libs/api';


 



export class NewAnnouncementForm extends React.Component {
   
  constructor(props) {
    super(props);

    this.state = {
          data:this.props.data,
          selectOptions: {},
          activities:[],
          isDisabled:true,
          filterByOrg:false
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
    
    //const language = this.props.i18n && this.props.i18n.language ? this.props.i18n.language : 'en';
    
    

    const params = getParams('selectsInForms', contentType, this.props);
    api
          .getEntire(params)
          .then((result) => {
            
            
            //this.props.updateTitle(result.body.title);
            result.body.map((set) => {
                data.push({value:set.id,label:set.title});
                return true;
            });
            selectOptions[contentType.id] = data;
            
            this.setState({selectOptions, isDisabled:false});
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
                      {/*<FormRowLayout infoLabel=''>
                                                <SelectInput
                                                                      id="fromOrganisation"
                                                                      type='text'
                                                                      label={props.t("From organisation")}
                                                                      disabled={selectOptions.organisations ? false : true}
                                                                      error={props.touched.fromOrganisation && props.errors.fromOrganisation}
                                                                      value={props.values.fromOrganisation}
                                                                      onChange={(event)=>this.customOnChange(event,props.handleChange)}
                                                                      onBlur={props.handleBlur}
                                                                      options={selectOptions.organisations || []}
                                                                    />
                                            </FormRowLayout>*/}
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
                                    <Grid container spacing={0}>
                                       <Grid item xs={12} sm={6}>
                                             <FormControlLabel
                                                     label={'Filter by Organisation'}
                                                     control= 
                                                     {<Checkbox checked = {this.state.filterByOrg}
                                                           onChange = {(e)=>{this.setState({filterByOrg:e.target.checked})}}
                                                           id = {'filterByOrg'}
                                                           name = {'filterByOrg'}
                                                           disabled={isDisabled}
                                                         />}
                                                /> 
                                         </Grid>
                                         <Grid item xs={12} sm={6}>
                                        
                                                       {this.state.filterByOrg && 
                                                             <SelectInput
                                                                id="fromOrganisation"
                                                                type='text'
                                                                label={props.t("Organisation")}
                                                                disabled={selectOptions.organisations && this.state.filterByOrg && !isDisabled ? false : true}
                                                                error={props.touched.fromOrganisation && props.errors.fromOrganisation}
                                                                value={props.values.fromOrganisation}
                                                                onChange={props.handleChange}
                                                                onBlur={props.handleBlur}
                                                                options={selectOptions.organisations || []}
                                                              />
                                                         }
                                                           
                                         </Grid>
                 
                                     </Grid>
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
